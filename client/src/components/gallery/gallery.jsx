import GalleryItem from "../galleryItem/galleryItem";
import "./gallery.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import Skeleton from "../skeleton/skeleton";

// Fetch pins from the backend API
const fetchPins = async ({ pageParam, search, userId, boardId }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_ENDPOINT}/pins?cursor=${pageParam}&search=${search || ""}&userId=${userId || ""}&boardId=${boardId || ""}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching pins:", error);
    throw error;
  }
};

const Gallery = ({ search, userId, boardId }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["pins", search, userId, boardId],
    queryFn: ({ pageParam = 0 }) =>
      fetchPins({ pageParam, search, userId, boardId }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
  });

  if (status === "pending") return <Skeleton />;
  if (status === "error") {
    console.error("Error loading pins:", error);
    return <p>Something went wrong while loading pins.</p>;
  }

  // Safely flatten pages and collect all pins
  const allPins =
    data?.pages.flatMap((page) => Array.isArray(page?.pins) ? page.pins : []) || [];

  return (
    <InfiniteScroll
      dataLength={allPins.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<h4>Loading more pins...</h4>}
      endMessage={<h3>All Posts Loaded!</h3>}
    >
      <div className="gallery">
        {allPins
          .filter((item) => item && item._id) // Ensure each item and _id is valid
          .map((item) => (
            <GalleryItem key={item._id} item={item} />
          ))}
      </div>
    </InfiniteScroll>
  );
};

export default Gallery;
