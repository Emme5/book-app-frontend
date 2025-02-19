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
  async ({ bookId, userId }, { rejectWithValue }) => {
      try {
          const serverUrl = import.meta.env.VITE_SERVER_URL;

          const response = await fetch(`${serverUrl}/api/favorites/${userId}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ bookIds: [bookId] })
          });

          const responseData = await response.json();

          if (!response.ok) {
              return rejectWithValue(responseData);
          }

          return responseData;
      } catch (error) {
          return rejectWithValue({
              message: error.message,
              name: error.name
          });
      }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async ({ bookId, userId }, { rejectWithValue }) => {
      try {
          const serverUrl = import.meta.env.VITE_SERVER_URL;
          
          console.log('Remove Favorites Input:', { bookId, userId });

          const response = await fetch(`${serverUrl}/api/favorites/${userId}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ bookIds: [bookId] })
          });

          const responseData = await response.json();

          if (!response.ok) {
              return rejectWithValue(responseData);
          }

          return responseData;
      } catch (error) {
          return rejectWithValue({
              message: error.message,
              name: error.name
          });
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
            // ตรวจสอบว่า action.payload เป็นอาร์เรย์
            state.favoriteItems = Array.isArray(action.payload) ? action.payload : [];
            state.loading = false;
         })
         
          .addCase(fetchUserFavorites.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message;
          })
          .addCase(addToFavorites.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addToFavorites.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || action.error.message;
          console.error('Add to Favorites Error:', action.payload);
      })
      .addCase(removeFromFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(removeFromFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
        console.error('Remove from Favorites Error:', action.payload);
    })
          // addToFavorites
          .addCase(addToFavorites.fulfilled, (state, action) => {
            state.favoriteItems = action.payload;
            state.loading = false;
          })
          .addCase(removeFromFavorites.fulfilled, (state, action) => {
            state.favoriteItems = action.payload;
            state.loading = false;
          })
    }
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;