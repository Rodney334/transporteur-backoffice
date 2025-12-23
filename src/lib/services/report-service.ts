import { api } from "../api/axios";

export const reportService = {
  async all() {
    const response = await api.post("report/couriers/summary/all", {});
    return response.data;
  },

  async daily() {
    const response = await api.post("report/couriers/summary/daily", {});
    return response.data;
  },

  async weekly() {
    const response = await api.post("report/couriers/summary/week", {});
    return response.data;
  },

  async monthly() {
    const response = await api.post("report/couriers/summary/month", {});
    return response.data;
  },

  async currentUser() {
    const response = await api.post("report/history/me", {});
    return response.data;
  },
};
