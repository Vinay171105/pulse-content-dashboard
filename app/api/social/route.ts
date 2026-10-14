import { NextResponse } from 'next/server';
import { demoSocial } from '@/lib/demoContent';
export async function GET(req:Request){const {searchParams}=new URL(req.url);const q=(searchParams.get('q')||'').toLowerCase();const items=demoSocial.filter(x=>!q||`${x.title} ${x.description} ${x.source}`.toLowerCase().includes(q));return NextResponse.json({items:items.length?items:(!q?demoSocial:[]),mode:'mock'});}
