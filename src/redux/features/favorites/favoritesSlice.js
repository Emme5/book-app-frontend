import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUserFavorites = createAsyncThunk(
   'favorites/fetchUserFavorites',
   async (userId) => {
       const serverUrl = import.meta.env.VITE_SERVER_URL;
       const response = await fetch(`${serverUrl}/api/favorites/${userId}`);
       
       if (!response.ok) {
           throw new Error('Failed to fetch favorites');
       }
       
       return response.json();
   }
);

export const addToFavorites = createAsyncThunk(
    'favorites/addToFavorites',
    async (book, { getState, rejectWithValue }) => {
      try {
        const state = getState();
        const currentUser = state.auth?.user;
  
        if (!currentUser) {
          throw new Error('No user logged in');
        }
  
        console.log('Adding book to favorites:', book);
  
        const response = await fetch(`/api/favorites/${currentUser.uid}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            bookIds: [...state.favorites.favoriteItems.map(b => b._id), book._id]
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update favorites');
        }
  
        return book;
      } catch (error) {
        console.error('Error adding to favorites:', error);
        return rejectWithValue(error.message);
      }
    }
  );

export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async (bookId, { getState, rejectWithValue }) => {
      try {
          const state = getState();
          const currentUser = state.auth.user;

          if (!currentUser) {
              throw new Error('No user logged in');
          }

          const updatedFavorites = state.favorites.favoriteItems.filter(
              item => item._id !== bookId
          );

          const response = await fetch(`/api/favorites/${currentUser.uid}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                  bookIds: updatedFavorites.map(book => book._id) 
              }),
          });

          if (!response.ok) {
              throw new Error('Failed to update favorites');
          }

          return updatedFavorites;
      } catch (error) {
          return rejectWithValue(error.message);
      }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
      favoriteItems: [],
      loading: false,
      error: null
  },
  reducers: {
      clearFavorites: (state) => {
          state.favoriteItems = [];
      }
  },
  extraReducers: (builder) => {
      builder
          // fetchUserFavorites
          .addCase(fetchUserFavorites.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(fetchUserFavorites.fulfilled, (state, action) => {
              state.favoriteItems = action.payload;
              state.loading = false;
          })
          .addCase(fetchUserFavorites.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message;
          })
          // addToFavorites
          .addCase(addToFavorites.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(addToFavorites.fulfilled, (state, action) => {
              if (!state.favoriteItems.find(item => item._id === action.payload._id)) {
                  state.favoriteItems.push(action.payload);
              }
              state.loading = false;
          })
          .addCase(addToFavorites.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message;
          })
          // removeFromFavorites
          .addCase(removeFromFavorites.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(removeFromFavorites.fulfilled, (state, action) => {
              state.favoriteItems = action.payload;
              state.loading = false;
          })
          .addCase(removeFromFavorites.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message;
          });
  }
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;