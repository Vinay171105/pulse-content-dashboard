import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
export type Category = 'Technology' | 'Business' | 'Science' | 'Sports' | 'Entertainment' | 'Health';
export type PreferencesState = { categories: Category[]; darkMode: boolean; favorites: string[]; activeSection: 'For you'|'Trending'|'Favorites'|'Settings' };
const defaults: PreferencesState = { categories: ['Technology','Science','Business'], darkMode: false, favorites: [], activeSection: 'For you' };
const preferencesSlice = createSlice({ name:'preferences', initialState:defaults, reducers:{
  toggleCategory(state, action:PayloadAction<Category>) { state.categories = state.categories.includes(action.payload) ? state.categories.filter(c=>c!==action.payload) : [...state.categories,action.payload]; },
  setDarkMode(state, action:PayloadAction<boolean>) { state.darkMode = action.payload; },
  toggleFavorite(state, action:PayloadAction<string>) { state.favorites = state.favorites.includes(action.payload) ? state.favorites.filter(id=>id!==action.payload) : [...state.favorites,action.payload]; },
  setSection(state, action:PayloadAction<PreferencesState['activeSection']>) { state.activeSection = action.payload; },
  hydratePreferences(state, action:PayloadAction<Partial<PreferencesState>>) { return {...state,...action.payload}; }
}});
export const { toggleCategory,setDarkMode,toggleFavorite,setSection,hydratePreferences } = preferencesSlice.actions;
export default preferencesSlice.reducer;
