import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
export type ContentItem = { id:string; type:'news'|'movie'|'social'; category:string; title:string; description:string; image:string; source:string; url:string; date:string; tag?:string };
type ContentState = { items:ContentItem[]; loading:boolean; error:string|null; page:number };
const initialState:ContentState = {items:[],loading:false,error:null,page:1};
export const fetchContent = createAsyncThunk<ContentItem[], {categories:string[]; query?:string}, {rejectValue:string}>('content/fetch', async ({categories,query}, {rejectWithValue})=>{
 try { const qs=new URLSearchParams({categories:categories.join(','),q:query||''}); const [n,m,s]=await Promise.all([fetch(`/api/news?${qs}`),fetch(`/api/recommendations?${qs}`),fetch(`/api/social?${qs}`)]); if(!n.ok||!m.ok||!s.ok) throw new Error('One or more content sources could not be loaded'); const data=await Promise.all([n.json(),m.json(),s.json()]); return [...data[0].items,...data[1].items,...data[2].items] as ContentItem[]; }
 catch(e) { return rejectWithValue(e instanceof Error?e.message:'Unable to load content'); }
});
const contentSlice=createSlice({name:'content',initialState,reducers:{setItems(state,action:PayloadAction<ContentItem[]>) {state.items=action.payload;},setPage(state,action:PayloadAction<number>){state.page=action.payload;}},extraReducers(builder){builder.addCase(fetchContent.pending,s=>{s.loading=true;s.error=null;}).addCase(fetchContent.fulfilled,(s,a)=>{s.loading=false;s.items=a.payload;}).addCase(fetchContent.rejected,(s,a)=>{s.loading=false;s.error=a.payload||'Unable to load content';});}});
export const {setItems,setPage}=contentSlice.actions;
export default contentSlice.reducer;
