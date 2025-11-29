import { createSlice } from '@reduxjs/toolkit';
import { Brand } from '@/services/brand-service';
import {
    getBrandsAction,
    createBrandAction,
    updateBrandAction,
    updateBrandLogoAction,
    toggleBrandStatusAction,
    deleteBrandAction,
} from './actions';

export type TBrandState = {
    brands: Brand[];
    total: number;
    loading: boolean;
    error: string | null;
};

const initialState: TBrandState = {
    brands: [],
    total: 0,
    loading: false,
    error: null,
};

const brandSlice = createSlice({
    name: 'brand',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Get Brands
        builder.addCase(getBrandsAction.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getBrandsAction.fulfilled, (state, action) => {
            state.loading = false;
            state.brands = action.payload.data.brands;
            state.total = action.payload.data.pagination.total;
        });
        builder.addCase(getBrandsAction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch brands';
        });

        // Create Brand
        builder.addCase(createBrandAction.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createBrandAction.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(createBrandAction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to create brand';
        });

        // Update Brand
        builder.addCase(updateBrandAction.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateBrandAction.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(updateBrandAction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to update brand';
        });

        // Update Brand Logo
        builder.addCase(updateBrandLogoAction.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateBrandLogoAction.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(updateBrandLogoAction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to update brand logo';
        });

        // Toggle Brand Status
        builder.addCase(toggleBrandStatusAction.pending, (state) => {
            state.error = null;
        });
        builder.addCase(toggleBrandStatusAction.fulfilled, (state, action) => {
            // Update brand in list
            const updatedBrand = action.payload.data.brand;
            const index = state.brands.findIndex(b => b._id === updatedBrand._id);
            if (index !== -1) {
                state.brands[index] = updatedBrand;
            }
        });
        builder.addCase(toggleBrandStatusAction.rejected, (state, action) => {
            state.error = action.error.message || 'Failed to toggle brand status';
        });

        // Delete Brand
        builder.addCase(deleteBrandAction.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteBrandAction.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(deleteBrandAction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete brand';
        });
    },
});

export const brandReducer = brandSlice.reducer;
