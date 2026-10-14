"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';

import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

import { Activity, Bell, Bookmark, ChevronDown, Compass, Flame, LayoutDashboard, Menu, Moon, Search, Settings2, SlidersHorizontal, Sparkles, Sun, X } from 'lucide-react';

import { motion } from 'framer-motion';

import { ContentCard } from './ContentCard';

import { useAppDispatch,useAppSelector } from '@/store/hooks';

import { fetchContent, type ContentItem } from '@/store/contentSlice';

import { hydratePreferences, setDarkMode, setSection, toggleCategory, toggleFavorite, type Category } from '@/store/preferencesSlice';

const categories:Category[]=['Technology','Business','Science','Sports','Entertainment','Health'];

const nav=[{label:'For you',icon:LayoutDashboard},{label:'Trending',icon:Flame},{label:'Favorites',icon:Bookmark},{label:'Settings',icon:Settings2}] as const;

function SortableCard({item,favorite,onFavorite}:{item:ContentItem;favorite:boolean;onFavorite:()=>void}){const {attributes,listeners,setNodeRef,transform,transition,isDragging}=useSortable({id:item.id});return <div ref={setNodeRef} style={{transform:CSS.Transform.toString(transform),transition,opacity:isDragging?.55:1,position:'relative'}} className="cursor-grab active:cursor-grabbing" {...attributes} {...listeners}><ContentCard item={item} favorite={favorite} onFavorite={onFavorite}/></div>}

export function Dashboard(){

 const dispatch=useAppDispatch();const {items,loading,error}=useAppSelector(s=>s.content);const prefs=useAppSelector(s=>s.preferences);const [query,setQuery]=useState('');const [debounced,setDebounced]=useState('');const [mobileOpen,setMobileOpen]=useState(false);const [orderedIds,setOrderedIds]=useState<string[]>([]);const [page,setPage]=useState(1);const [preferencesHydrated,setPreferencesHydrated]=useState(false);

 useEffect(()=>{
  try {
    const raw = localStorage.getItem('pulse-preferences');
    if (raw) dispatch(hydratePreferences(JSON.parse(raw)));
  } catch (error) {
    console.error('Failed to load preferences:', error);
  } finally {
    setPreferencesHydrated(true);
  }
}, [dispatch]);

useEffect(()=>{
  if (!preferencesHydrated) return;
  try {
    localStorage.setItem('pulse-preferences', JSON.stringify(prefs));
    document.documentElement.classList.toggle('dark', prefs.darkMode);
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
}, [prefs, preferencesHydrated]);

 useEffect(()=>{const t=setTimeout(()=>setDebounced(query.trim()),350);return()=>clearTimeout(t);},[query]);

 useEffect(()=>{dispatch(fetchContent({categories:prefs.categories,query:debounced}));setPage(1);},[dispatch,prefs.categories,debounced]);

 useEffect(()=>{setOrderedIds(old=>{const ids=items.map(i=>i.id);return [...old.filter(id=>ids.includes(id)),...ids.filter(id=>!old.includes(id))]});},[items]);

 const sensors=useSensors(useSensor(PointerSensor,{activationConstraint:{distance:6}}));

 const sorted=useMemo(()=>{const map=new Map(items.map(i=>[i.id,i]));return orderedIds.map(id=>map.get(id)).filter((x):x is ContentItem=>!!x);},[items,orderedIds]);

 const filtered=useMemo(()=>{let list=sorted;if(prefs.activeSection==='Favorites')list=list.filter(i=>prefs.favorites.includes(i.id));if(prefs.activeSection==='Trending')list=[...list].sort((a,b)=>a.title.localeCompare(b.title));return list;},[sorted,prefs.activeSection,prefs.favorites]);

 const pageSize=6;const visible=filtered.slice(0,page*pageSize);const onDragEnd=useCallback((event:DragEndEvent)=>{const {active,over}=event;if(over&&active.id!==over.id)setOrderedIds(ids=>{const old=ids.indexOf(String(active.id)),next=ids.indexOf(String(over.id));return old<0||next<0?ids:arrayMove(ids,old,next)});},[]);

 const chooseSection=(label:typeof prefs.activeSection)=>{dispatch(setSection(label));setMobileOpen(false)};

 return <div className="min-h-screen" style={{background:'var(--bg)',color:'var(--text)'}}>

  <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r p-5 transition-transform lg:translate-x-0 ${mobileOpen?'translate-x-0':'-translate-x-full'}`} style={{background:'var(--panel)',borderColor:'var(--line)'}}><div className="mb-10 flex items-center gap-3 px-2"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-600 text-white"><Activity size={21}/></div><div><div className="text-xl font-black tracking-tight">pulse<span className="text-violet-500">.</span></div><div className="text-[10px] font-semibold uppercase tracking-[.2em] muted">Your daily signal</div></div><button className="ml-auto lg:hidden" onClick={()=>setMobileOpen(false)} aria-label="Close menu"><X/></button></div>

  <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] muted">Workspace</p><nav className="space-y-1">{nav.map(({label,icon:Icon})=><button key={label} onClick={()=>chooseSection(label)} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition" style={{background:prefs.activeSection===label?'rgba(99,91,255,.11)':'transparent',color:prefs.activeSection===label?'var(--accent)':'var(--muted)'}}><Icon size={18}/>{label}<span className="ml-auto">{label==='Favorites'&&prefs.favorites.length>0?prefs.favorites.length:''}</span></button>)}</nav>

  <div className="my-7 border-t" style={{borderColor:'var(--line)'}}/><div className="mb-3 flex items-center justify-between px-3"><p className="text-[10px] font-bold uppercase tracking-[.18em] muted">Your interests</p><SlidersHorizontal size={14} className="muted"/></div><div className="space-y-1">{categories.map((cat,i)=><button key={cat} onClick={()=>dispatch(toggleCategory(cat))} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-violet-500/10"><span className="h-2 w-2 rounded-full" style={{background:['#8278ff','#f59e0b','#22c55e','#ef4444','#ec4899','#06b6d4'][i]}}/><span className="flex-1 text-left">{cat}</span><span className="text-xs">{prefs.categories.includes(cat)?'✓':''}</span></button>)}</div>

  <div className="mt-auto rounded-2xl p-4" style={{background:'linear-gradient(135deg,rgba(99,91,255,.14),rgba(14,165,233,.08))'}}><Sparkles size={18} className="mb-3 text-violet-500"/><p className="text-sm font-bold">A feed that feels like you.</p><p className="mt-1 text-xs leading-5 muted">Tune your interests and save the stories worth coming back to.</p></div><div className="mt-4 flex items-center gap-3 rounded-xl p-2"><div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-xs font-bold text-white">VK</div><div className="min-w-0 flex-1"><p className="text-sm font-bold">Your workspace</p><p className="text-xs muted">Personal dashboard</p></div><ChevronDown size={15} className="muted"/></div></aside>

  {mobileOpen&&<button className="fixed inset-0 z-30 bg-black/30 lg:hidden" aria-label="Close navigation overlay" onClick={()=>setMobileOpen(false)}/>}

  <main className="min-h-screen lg:pl-64"><header className="sticky top-0 z-20 border-b px-4 py-4 backdrop-blur-xl sm:px-8" style={{background:'color-mix(in srgb, var(--bg) 88%, transparent)',borderColor:'var(--line)'}}><div className="mx-auto flex max-w-7xl items-center gap-3"><button className="lg:hidden" onClick={()=>setMobileOpen(true)} aria-label="Open menu"><Menu/></button><div className="relative max-w-xl flex-1"><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 muted"/><input aria-label="Search content" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search stories, movies, topics..." className="w-full rounded-xl border py-3 pl-11 pr-10 text-sm outline-none transition focus:border-violet-400" style={{background:'var(--panel)',borderColor:'var(--line)',color:'var(--text)'}}/>{query&&<button onClick={()=>setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 muted" aria-label="Clear search"><X size={15}/></button>}</div><button className="relative grid h-11 w-11 place-items-center rounded-xl border" aria-label="Notifications" style={{background:'var(--panel)',borderColor:'var(--line)'}}><Bell size={18}/><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500"/></button><button onClick={()=>dispatch(setDarkMode(!prefs.darkMode))} className="grid h-11 w-11 place-items-center rounded-xl border" aria-label="Toggle dark mode" style={{background:'var(--panel)',borderColor:'var(--line)'}}>{prefs.darkMode?<Sun size={18}/>:<Moon size={18}/>}</button><div className="hidden items-center gap-2 border-l pl-4 sm:flex" style={{borderColor:'var(--line)'}}><div className="grid h-9 w-9 place-items-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">VK</div><div><p className="text-xs font-bold">Welcome back</p><p className="text-[11px] muted">Your daily briefing</p></div></div></div></header>

  <div className="mx-auto max-w-7xl px-4 py-7 sm:px-8 sm:py-9"><section className="mb-8 overflow-hidden rounded-3xl p-6 text-white sm:p-9" style={{background:'linear-gradient(115deg,#24234a 0%,#5145cd 58%,#8c7bff 100%)'}}><div className="relative z-10 flex flex-col justify-between gap-7 sm:flex-row sm:items-end"><div className="max-w-xl"><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300"/> YOUR PERSONALIZED BRIEFING</div><h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">Good things happen<br className="hidden sm:block"/> when you <span className="text-violet-200">stay curious.</span></h1><p className="mt-3 max-w-md text-sm leading-6 text-white/75">A little signal, less noise. Your interests, stories, and discoveries — all in one place.</p></div><div className="flex gap-3"><div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3"><p className="text-2xl font-black">{items.length}</p><p className="text-[11px] text-white/70">Fresh picks</p></div><div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3"><p className="text-2xl font-black">{prefs.favorites.length}</p><p className="text-[11px] text-white/70">Saved items</p></div></div></div></section>

  <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3"><div className="panel flex items-center gap-4 p-4"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-100 text-violet-700"><Compass size={20}/></div><div><p className="text-xs muted">Your interests</p><p className="mt-0.5 text-lg font-extrabold">{prefs.categories.length} topics</p></div></div><div className="panel flex items-center gap-4 p-4"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-100 text-orange-600"><Flame size={20}/></div><div><p className="text-xs muted">Content mix</p><p className="mt-0.5 text-lg font-extrabold">News · Movies · Social</p></div></div><div className="panel flex items-center gap-4 p-4"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><Bookmark size={20}/></div><div><p className="text-xs muted">Your collection</p><p className="mt-0.5 text-lg font-extrabold">{prefs.favorites.length} saved picks</p></div></div></div>

  {prefs.activeSection==='Settings'?<section className="panel p-6"><h2 className="text-xl font-extrabold">Personalize your dashboard</h2><p className="mt-1 text-sm muted">Choose the topics you want to see in your feed. Changes are saved in this browser.</p><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{categories.map(cat=><button key={cat} onClick={()=>dispatch(toggleCategory(cat))} className="flex items-center justify-between rounded-xl border p-4 text-sm font-semibold" style={{borderColor:prefs.categories.includes(cat)?'var(--accent)':'var(--line)',background:prefs.categories.includes(cat)?'rgba(99,91,255,.08)':'var(--panel)'}}>{cat}<span>{prefs.categories.includes(cat)?'✓':'+'}</span></button>)}</div><button onClick={()=>dispatch(setDarkMode(!prefs.darkMode))} className="mt-5 flex items-center gap-3 rounded-xl border p-4 text-sm font-semibold" style={{borderColor:'var(--line)'}}>{prefs.darkMode?<Sun size={18}/>:<Moon size={18}/>} {prefs.darkMode?'Switch to light mode':'Switch to dark mode'}</button></section>:<><div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em]" style={{color:'var(--accent)'}}><Sparkles size={14}/> {prefs.activeSection==='Favorites'?'YOUR COLLECTION':prefs.activeSection==='Trending'?'WHAT’S TRENDING':'CURATED FOR YOU'}</div><h2 className="text-2xl font-black tracking-tight">{prefs.activeSection==='Favorites'?'Saved for later':prefs.activeSection==='Trending'?'Trending right now':'Your content feed'}</h2><p className="mt-1 text-sm muted">{debounced?`Search results for “${debounced}”`:'A fresh mix based on what you care about.'}</p></div><div className="rounded-full border px-3 py-2 text-xs font-semibold muted" style={{borderColor:'var(--line)'}}>{filtered.length} items <span className="mx-1">·</span> Drag cards to reorder</div></div>

  {loading&&<div className="mb-4 flex items-center gap-2 text-sm muted"><span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 border-t-transparent"/>Refreshing your feed…</div>}{error&&<div role="alert" className="mb-4 rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700">{error}. Showing any available content; try refreshing the page.</div>}

  {!loading&&visible.length===0?<div className="panel flex flex-col items-center px-6 py-16 text-center"><div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-violet-100 text-violet-700"><Search size={24}/></div><h3 className="text-lg font-bold">Nothing here just yet</h3><p className="mt-2 max-w-sm text-sm muted">{prefs.activeSection==='Favorites'?'Save a story or recommendation with the bookmark icon and it will appear here.':'Try another search or select more interests in your settings.'}</p><button onClick={()=>{setQuery('');chooseSection('For you')}} className="mt-5 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white">Explore your feed</button></div>:<><DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}><SortableContext items={visible.map(i=>i.id)} strategy={rectSortingStrategy}><motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">{visible.map(item=><SortableCard key={item.id} item={item} favorite={prefs.favorites.includes(item.id)} onFavorite={()=>dispatch(toggleFavorite(item.id))}/>)}</motion.div></SortableContext></DndContext>{visible.length<filtered.length&&<div className="mt-8 flex justify-center"><button onClick={()=>setPage(p=>p+1)} className="rounded-xl border px-5 py-3 text-sm font-bold transition hover:border-violet-400" style={{background:'var(--panel)',borderColor:'var(--line)'}}>Load more content <span className="ml-2 muted">↓</span></button></div>}</>}

  </>}

  <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t py-5 text-xs muted" style={{borderColor:'var(--line)'}}><span>© 2026 Pulse Dashboard</span><span>Made for curious minds · Preferences saved locally</span></footer></div></main></div>;

}
