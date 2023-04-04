import { Outlet } from 'react-router-dom';

import {
  CoursePreviewProvider,
  ProductsContainer,
  SavedCoursesProvider,
} from '@luxus/web';


type TLayoutProps = {
};

// console.log({
//   CoursePreviewProvider,
//   SavedCoursesProvider,
//   ProductsContainer,
// });

// TODO: implement sendPageView (facebook pixel)
export const Layout: React.FC<TLayoutProps> = props => {
  return (
    <div>
      <ProductsContainer>
        <CoursePreviewProvider>
          <SavedCoursesProvider>
            <Outlet />
          </SavedCoursesProvider>
        </CoursePreviewProvider>
      </ProductsContainer>
    </div>
  );
};

export default Layout;
