import { Heart, Edit, Trash,Star } from 'lucide-react';  // Import the icons from lucide-react
import Link from 'next/link';

const ReviewsAndComments = ({ comments, user, handleCommentSubmit, handleLike, handleEdit, handleDelete, newComment, setNewComment, newRating, setNewRating, addingReview }) => {
  // Check if the user has already commented
  const userHasCommented = comments.some(comment => comment.user.id === user.id);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Reviews and Comments</h2>
      
      {comments.map((comment) => (
        <div key={comment.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
          <div className="flex justify-between items-center mb-2">
            {/* User's Profile Image and Username */}
            <Link href={`/profile/${comment.user.id}?id=${comment.user.id}`}>
            <div className="flex items-center">

              <img 
                src={comment.user.profile_image || "/default_profile_image.png"} 
                alt={`${comment.user.username}'s profile`} 
                className="h-8 w-8 rounded-full mr-2" 
              />
              <p className="font-semibold text-gray-900 dark:text-white">{comment.user.username}</p>
            </div>
            </Link>

            {/* Rating */}
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < comment.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>

          {/* Comment Content */}
          <p className="text-gray-600 dark:text-gray-300 mb-2">{comment.content}</p>

          {/* Like Button */}
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <button onClick={() => handleLike(comment.id)} className="flex items-center mr-2">
              <Heart 
                className={`h-4 w-4 mr-1 ${comment.liked ? 'text-red-500 fill-current' : 'text-gray-300'}`} 
              />
              <span>{comment.likes}</span>
            </button>
            {/* Edit and Delete buttons */}
            {comment.user.id === user.id && (
              <div className="flex items-center space-x-2">
                <button onClick={() => handleEdit(comment.id)} className="text-blue-500 hover:text-blue-700">
                  <Edit className="h-5 w-5" />
                </button>
                <button onClick={() => handleDelete(comment.id)} className="text-red-500 hover:text-red-700">
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Form to Submit New Comment (hidden if user has already commented) */}
      {!userHasCommented && (
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Rating
            </label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className={`${
                    star <= newRating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400 focus:outline-none`}
                >
                  <Star className="h-6 w-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Comment Textarea */}
          <textarea
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
            rows={4}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={addingReview}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-blue-200"
          >
            {addingReview ? 'Posting a comment...' : 'Post Comment'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ReviewsAndComments;
