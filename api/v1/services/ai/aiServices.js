import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = "https://api.together.xyz/v1/chat/completions";
const API_KEY = process.env.LLAMA_API_KEY;

export const generatePostContent = async (topic) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        messages: [
          {
            role: "user",
            content: `Viết một bài blog về chủ đề: "${topic}" với định dạng đẹp hơn.
                      - Dùng markdown (h1, h2, h3, **bold**, *italic*)
                      - Viết ngắn gọn, súc tích
                      - Dùng gạch đầu dòng nếu cần
                      - Xuống dòng hợp lý
                      - Tạo danh sách bullet nếu cần
                      - Xuống dòng hợp lý
                      - Thêm trích dẫn nếu có thể`,
          },
        ],
      },
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );

    return response.data.choices?.[0]?.message?.content || "Không có nội dung trả về";
  } catch(error) {
    console.error("Lỗi khi gọi Together AI:", error.response?.data || error.message);
    throw new Error("Không thể tạo bài viết");
  }
};
