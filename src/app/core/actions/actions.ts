import { Action } from '@ngrx/store';

import * as types from '../constants/constants';


/************************** Cart Action ***************************/

/**
 * Add to Cart
 */
export class AddToCartAction implements Action {
    readonly type = types.ADD_TO_CART;
    constructor(public payload: { product: any, qty: number }) { }
}

/**
 * Remove from Cart
 */
export class RemoveFromCartAction implements Action {
    readonly type = types.REMOVE_FROM_CART;
    constructor(public payload: { product: any }) { }
}

/**
 * Update Cart Items with qtys
 */
export class UpdateCartAction implements Action {
    readonly type = types.UPDATE_CART;
    constructor(public payload: { cartItems: any[] }) { }
}


/************************** Wishlist Action ***************************/

/**
 * Add to Wishlist
 */
export class AddToWishListAction implements Action {
    readonly type = types.ADD_TO_WISHLIST;
    constructor(public payload: { product: any }) { }
}

/**
 * Remove from WishList
 */
export class RemoveFromWishListAction implements Action {
    readonly type = types.REMOVE_FROM_WISHLIST;
    constructor(public payload: { product: any }) { }
}



/************************** Compare Action ***************************/

/**
 * Add to Compare
 */
export class AddToCompareAction implements Action {
    readonly type = types.ADD_TO_COMPARE;
    constructor(public payload: { product: any }) { }
}

/**
 * Remove from Compare
 */
export class RemoveFromCompareAction implements Action {
    readonly type = types.REMOVE_FROM_COMPARE;
    constructor(public payload: { product: any }) { }
}

/**
 * Remove all in compare list
 */
export class ClearAllCompareAction implements Action {
    readonly type = types.REMOVE_ALL_COMPARE;
    constructor(public payload: {}) { }
}

/**
 * Refresh store when demo changes
 */
export class RefreshStoreAction implements Action {
    readonly type = types.REFRESH_STORE;
    constructor() { }
}
