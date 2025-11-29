import client from './api-clients';

export const getExampleApi = async (id: number) => {
  const response = await client.get('/example', { params: { id } });
  return response;
};
