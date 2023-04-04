type TCoursePreviewProviderProps = {}

const CoursePreviewProvider: React.FC<React.PropsWithChildren<TCoursePreviewProviderProps>> = props => {
  return <div>{props.children}</div>
}

export default CoursePreviewProvider
