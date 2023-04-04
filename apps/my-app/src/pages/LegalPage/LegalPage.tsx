import { createBrowserRouter, RouterProvider } from 'react-router-dom';

type TLegalPageProps = {};
import { Layout } from '../../shared/Layout';

type TAppProps = {
  updatedAt: string;
};
export const App: React.FC<TAppProps> = ({ updatedAt }) => {
  return <div> legal page - {updatedAt}</div>;
};

const router = createBrowserRouter([
  { path: '/', element: <div>root</div> },
  {
    // key: 'TERMS_AND_CONDITIONS',
    path: 'terminos-y-condiciones',
    element: <div> updatedAt 6 de Mayo de 2021</div>,
  },
  {
    path: '/legals',
    element: <Layout />,
    children: [
      {
        // key: 'TERMS_AND_CONDITIONS',
        path: 'terminos-y-condiciones',
        element: <App updatedAt="6 de Mayo de 2021" />,
      },
    ],
  },
]);
export const LegalPage: React.FC<TLegalPageProps> = () => {
  return <RouterProvider router={router} />;
};

export default LegalPage;
