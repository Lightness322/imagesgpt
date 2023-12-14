/* eslint-disable react/prop-types */
export default function Progress({ answers, images, isLoading }) {
  return (
    <>
      {isLoading && (
        <div className="flex gap-x-2 text-lg font-medium items-center">
          <span>Прогресс</span>
          <span>{Math.round((answers.length / images.length) * 100)}%</span>
          <span className="h-8 w-8 border-solid border-r-transparent rounded-full animate-spin"></span>
        </div>
      )}
    </>
  )
}
