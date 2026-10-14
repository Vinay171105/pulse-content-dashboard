"use client";
import Image from 'next/image';
import { Bookmark, ExternalLink, GripVertical, MessageCircle, Newspaper, PlayCircle } from 'lucide-react';
import type { ContentItem } from '@/store/contentSlice';
export function ContentCard({item,favorite,onFavorite,dragHandleProps}:{item:ContentItem;favorite:boolean;onFavorite:()=>void;dragHandleProps?:Record<string,unknown>}){
 const Icon=item.type==='movie'?PlayCircle:item.type==='social'?MessageCircle:Newspaper;
 return <article className="panel group overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-soft" data-testid="content-card">
  <div className="relative h-44 overflow-hidden bg-slate-100"><Image src={item.image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" unoptimized/><div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-slate-700">{item.tag||item.type.toUpperCase()}</div><button aria-label={favorite?'Remove from favorites':'Add to favorites'} onClick={onFavorite} className={`absolute right-3 top-3 rounded-full p-2 shadow-sm transition ${favorite?'bg-violet-600 text-white':'bg-white/90 text-slate-600 hover:text-violet-600'}`}><Bookmark size={16} fill={favorite?'currentColor':'none'}/></button></div>
  <div className="p-4"><div className="mb-2 flex items-center justify-between text-xs muted"><span className="flex items-center gap-1.5"><Icon size={14}/>{item.source}</span><span>{new Date(item.date).toLocaleDateString(undefined,{month:'short',day:'numeric'})}</span></div><h3 className="mb-2 line-clamp-2 text-base font-bold leading-snug">{item.title}</h3><p className="mb-4 line-clamp-3 text-sm leading-6 muted">{item.description}</p><div className="flex items-center justify-between border-t pt-3" style={{borderColor:'var(--line)'}}><span className="text-xs font-semibold" style={{color:'var(--accent)'}}>{item.category}</span><a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold hover:underline">{item.type==='movie'?'Explore':'Read more'} <ExternalLink size={13}/></a></div></div>
  <button type="button" aria-label={`Drag ${item.title}`} className="absolute hidden" {...(dragHandleProps||{})}><GripVertical size={14}/></button>
 </article>;
}
