import axios from 'axios';

export default {
  bind: () => axios.post(
    '/vdap/bind',
    {},
    {
      headers: {
        bindCredentials: window.localStorage.bindCredentials
      }
    }
  ),
  search: data => axios.post('/vdap/read', data, {
    headers: {
      bindCredentials: window.localStorage.bindCredentials
    }
  }),
  create: data => axios.post('/vdap/create', data, {
    headers: {
      bindCredentials: window.localStorage.bindCredentials
    }
  }),
  update: data => axios.post('/vdap/update', data, {
    headers: {
      bindCredentials: window.localStorage.bindCredentials
    }
  }),
  delete: data => axios.post('/vdap/delete', data, {
    headers: {
      bindCredentials: window.localStorage.bindCredentials
    }
  }),
  reports: () => axios.get('/reports')
};
