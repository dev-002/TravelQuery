// const baseURL = process.env.BASEURL + "/api/v1";
const baseURL = "http://192.168.1.35:5000/api/v1";

export default {
  Auth: {
    register: baseURL + "/auth/register", // post
    login: baseURL + "/auth/login", // post
    logout: baseURL + "/auth/logout",
    sendOTP: baseURL + "/auth/forget", // post
    verifyOTP: baseURL + "/auth/verify", // post
    changePass: baseURL + "/auth/change", // post
  },
  Place: {
    fetchPlace: baseURL + "/places", // :id
    addPlace: baseURL + "/places/add", // post
    updatePlace: baseURL + "/places", // :id put
    removePlace: baseURL + "/places", // :id delete
    searchPlace: baseURL + "/places/search", // post
  },
  User: {
    getAllUsers: baseURL + "/users",
    getSpecificUser: baseURL + "/users", // post
    updateUser: baseURL + "/users", // :id put
    removeUser: baseURL + "/users", // :id delete
  },
  TravelPlan: {
    getAllTravelPlan: baseURL + "/travel-plans",
    getSpecificTravelPlan: baseURL + "/travel-plans", // :id
    addTravelPlan: baseURL + "/travel-plans", // post
    updateTravelPlan: baseURL + "/travel-plans", // :id put
    removeTravelPlan: baseURL + "/travel-plans", // :id delete

    serachMember: baseURL + "/travel-plans/search/member", // post
    serachPlaces: baseURL + "/travel-plans/search/places", // post
    serachGuide: baseURL + "/travel-plans/search/guide", // post
  },
  Guide: {
    getAllTourGuide: baseURL + "/guide",
    getSpecificTourGuide: baseURL + "/guide", // :id
    updateTourGuide: baseURL + "/guide", // :id put
    removeTourGuide: baseURL + "/guide", // :id delete
  },
  Profile: {
    getProfile: baseURL + "/profile", // :id
    updateProfile: baseURL + "/profile", // :id put
    fetchWishlist: baseURL + "/profile/wishlist",
    addWishlist: baseURL + "/profile/wishlist", // :id post
    checkWishlist: baseURL + "/profile/wishlist/check",
  },
};
