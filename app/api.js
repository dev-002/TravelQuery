// const baseURL = process.env.BASEURL + "/api/v1";
const baseURL = "http://192.168.1.35:5000/api/v1";

export default {
  Auth: {
    register: baseURL + "/auth/register", // post
    login: baseURL + "/auth/login", // post
    logout: baseURL + "/auth/logout",
  },
  Place: {
    fetchPlace: baseURL + "/places", // :id
    addPlace: baseURL + "/places/add", // post
    updatePlace: baseURL + "/places", // :id put
    removePlace: baseURL + "/places", // :id delete
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
