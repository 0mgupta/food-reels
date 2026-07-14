import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'

const localVideos = [
  { _id: '1', video: '/vdeos/burger.jpg.mp4', name: 'Burger', description: 'Crispy juicy burger 🍔', likeCount: 0, savesCount: 0 },
  { _id: '2', video: '/vdeos/fries.jpg.mp4', name: 'Fries', description: 'Golden crispy fries 🍟', likeCount: 0, savesCount: 0 },
  { _id: '3', video: '/vdeos/pancakes.jpg.mp4', name: 'Pancakes', description: 'Fluffy pancakes 🥞', likeCount: 0, savesCount: 0 },
  { _id: '4', video: '/vdeos/kadhai-chaap.jpg.mp4', name: 'Kadhai Chaap', description: 'Spicy kadhai chaap 🌶️', likeCount: 0, savesCount: 0 },
  { _id: '5', video: '/vdeos/matka-biriyani.jpg.mp4', name: 'Matka Biryani', description: 'Aromatic matka biryani 🍛', likeCount: 0, savesCount: 0 },
  { _id: '6', video: '/vdeos/Tandoori-momo.jpg.mp4', name: 'Tandoori Momo', description: 'Smoky tandoori momos 🥟', likeCount: 0, savesCount: 0 },
]

const Home = () => {
  const [videos, setVideos] = useState(localVideos)

  useEffect(() => {
    axios.get("http://localhost:3000/api/food", { withCredentials: true })
      .then(response => {
        if (response.data.foodItems?.length > 0) {
          setVideos(response.data.foodItems)
        }
      })
      .catch(() => {
        // Using local videos as fallback
      })
  }, [])

  async function likeVideo(item) {
    try {
      const response = await axios.post("http://localhost:3000/api/food/like", { foodId: item._id }, { withCredentials: true })
      if (response.data.like) {
        setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v))
      } else {
        setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v))
      }
    } catch {
      // noop
    }
  }

  async function saveVideo(item) {
    try {
      const response = await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true })
      if (response.data.save) {
        setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount + 1 } : v))
      } else {
        setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount - 1 } : v))
      }
    } catch {
      // noop
    }
  }

  return (
    <div className="reels-page">
      <ReelFeed
        items={videos}
        onLike={likeVideo}
        onSave={saveVideo}
        emptyMessage="No videos available."
      />
    </div>
  )
}

export default Home