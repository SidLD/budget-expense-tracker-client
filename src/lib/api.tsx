import axios from "axios";;
import { dataHeader } from "./helper";
import { LoginFormData, SignUpFormData } from "./interface";
import { auth } from "./services";
console.log(import.meta.env.VITE_API_URL)
export const login = (data:LoginFormData) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${import.meta.env.VITE_API_URL}/login`, data)
        .then((res:any) => {
          resolve(res);
        })
        .catch((err:any) => {
          reject(err);
        });
    });
};

export const register = (data:SignUpFormData) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/register`, data, dataHeader())
      .then((res:any) => {
        resolve(res);
      })
      .catch((err:any) => {
        reject(err);
      });
  });
};

export const updateUser = (data:any) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/user/status`, data, dataHeader())
      .then((res:any) => {
        resolve(res);
      })
      .catch((err:any) => {
        reject(err);
      });
  });
};

export const getUsers = (data:any) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_API_URL}/users`, {
            data, ...dataHeader()
        })
        .then((res:any) => {
          resolve(res);
        })
        .catch((err:any) => {
          reject(err);
        });
    });
};

export const deleteUser = (data:any) => {
    return new Promise((resolve, reject) => {
      axios
        .delete(`${import.meta.env.VITE_API_URL}/user`, {
            data,
            ...dataHeader()
        })
        .then((res:any) => {
          resolve(res);
        })
        .catch((err:any) => {
          reject(err);
        });
    });
};


// Set Budget API
export const setBudget = (userId: string, budget: number) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${import.meta.env.VITE_API_URL}/budget/${userId}`,
        { value: budget },
        dataHeader()
      )
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

// Get Budget API (Optional: if you need to fetch the user's budget directly)
export const getBudget = (userId: string) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/budget/${userId}`, dataHeader())
      .then((res: any) => {
        if(res.data.isLoggingIn == false){
          auth.clear()
          window.location.href = '/'
        }else {
          resolve(res);
        }
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

// Get Expenses API
export const getExpenses = (userId: string) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/expense/${userId}`, dataHeader())
      .then((res: any) => {
        if(res.data.isLoggingIn == false){
          auth.clear()
          window.location.href = '/'
        }else {
          resolve(res);
        }
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};


export const addExpense = (userId: string, amount: number, description: string, date: Date) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/expense/${userId}`,
        { amount , description, date},
        dataHeader()
      )
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};

export const updateExpense = (_userId: string,  id: string, amount: number, description: string, date: Date) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `${import.meta.env.VITE_API_URL}/expense/${id}`,
        { amount , description, date},
        dataHeader()
      )
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};


export const deleteExpense = (_userId: string, id: string) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(
        `${import.meta.env.VITE_API_URL}/expense/${id}`,
        {...dataHeader()},
      )
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};


export const resetExpenses = (userId: string) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/expenses/reset/${userId}`,
        {},
        dataHeader()
      )
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};