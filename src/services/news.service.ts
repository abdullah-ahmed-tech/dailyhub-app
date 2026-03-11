import axios from "axios";

const API_KEY = "YOUR_GNEWS_API_KEY";

export async function getNews(category: string) {
  const res = await axios.get("https://gnews.io/api/v4/top-headlines", {
    params: {
      token: API_KEY,
      topic: category,
      lang: "en",
      max: 10
    }
  });

  return res.data.articles;
}