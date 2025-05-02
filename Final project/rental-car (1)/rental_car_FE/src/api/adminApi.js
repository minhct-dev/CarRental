import fetch from "./fetch";

export const getUserList = async () => {
  let data = await fetch.get("/admin/users");
  return data.data.data;
};
export const banUser = async ({ userId, hours, reason }) => {
  let response = await fetch.post(
    `/admin/ban/${userId}?hours=${hours}&reason=${encodeURIComponent(reason)}`
  );
  return response.data.data;
};

  export const unBanUser = async (userId) => {
    let response = await fetch.post(`/admin/unban/${userId}`);
    return response.data.data;
    
  };
  export const sendMail = async ({ userId, subject, content }) => {
    let response = await fetch.post(`/admin/send-email/${userId}?subject=${encodeURIComponent(subject)}&content=${encodeURIComponent(content)}`)
    return response.data.data;
  };
  
  export const getUserDraft = async (page = 1 , status = "", sort = "", search = "") => {
    try {
      const response = await fetch.get("/admin/draft-list", {
        params: {
          search: search,
          page,
          status: status || undefined,
          sort: sort || undefined
        }
      });
      
      const responseData = response.data.data;
      
      return {
        drafts: responseData.drafts || [],
        totalPages: responseData.totalPages || 1,
        currentPage: responseData.currentPage || 1,
        pageSize: responseData.pageSize || 10,
        numberOfAll: responseData.numberOfAll || 0,
        numberOfPending: responseData.numberOfPending || 0,
        numberOfApprove: responseData.numberOfApprove || 0,
        numberOfReject: responseData.numberOfReject || 0

      };
    } catch (error) {
      console.error("Error fetching user drafts:", error);
      return { drafts: [], totalPages: 1, currentPage: 1, pageSize: 10 };
    }
  };
export const approveDraft = async (draftId) => {
  let response = await fetch.put(`/admin/approve-user/${draftId}`);
  return response.data.data;
};
export const rejectDraft = async (draftId, reason) => {
  let response = await fetch.put(
    `/admin/reject-user/${draftId}?reason=${encodeURIComponent(reason)}`
  );
  return response.data.data;
};
export const createUser = async (data) => {
  let response = await fetch.post(`/admin/add-user`, data);
  return response.data.data;
};
export const getlatestDraft = async (draftId) => {
  let response = await fetch.get(`/admin/profile-draft/${draftId}`);
  return response.data.data;
};
export const getPercentageCancelCarOwner = async (bookingId, cancelDate) => {
  let response = await fetch.get("/booking/get-value-owner", {
    params: { bookingId: bookingId, cancelDate: cancelDate },
  });
  return response.data.data;
};
export const updateUser = async (userId, data) => {
  console.log("Requesting update for user ID:", userId, "with data:", data);

  let response = await fetch.post(`/admin/update-user/${userId}`, data);
  return response.data.data;
};
export const userProfile = async (Id) => {
  let content = await fetch.get(`/admin/user-detail/${Id}`);
  return content.data.data;
};

export const searchUsers = async (page = 1, searchParams = {}) => {
  try {
    const { searchTerm, roleId, status, isBan, sort } = searchParams;
    
    const response = await fetch.get("/admin/users-search", {
      params: {
        page,
        name: searchTerm || undefined,
        roleId: roleId || undefined,
        status: status || undefined,
        isBan: isBan !== undefined ? isBan : undefined,
        sort: sort || undefined
      }
    });
    
    return {
      users: response.data.data.users || [],
      totalPages: response.data.data.totalPages || 1,
      currentPage: response.data.data.currentPage || 1,
      pageSize: response.data.data.pageSize || 10
    };
  }
  catch (error) {
    console.error("Error searching users:", error);
    return { users: [], totalPages: 1, currentPage: 1, pageSize: 10 };
  }
};



export const getDashboardAdminApi = async (
  startWeekDate,
  endWeekDate,
  startMonthDate,
  endMonthDate
) => {
  let response = await fetch.get("/admin/dashboard", {
    params: {
      startWeekDate,
      endWeekDate,
      startMonthDate,
      endMonthDate,
    },
  });
  return response.data.data;
};

