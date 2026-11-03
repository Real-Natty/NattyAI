import { MessageSquareText, FileText, ShoppingBag } from "lucide-react";

export const tools = [
  {
    id: "social",
    title: "Social Media Writer",
    description: "Create engaging posts for Facebook, Instagram and more.",
    icon: MessageSquareText,
    color: "purple",
    placeholder: "Describe the social media post you want to create...",
  },
  {
    id: "blog",
    title: "Blog Writer",
    description: "Turn your ideas into compelling blog articles.",
    icon: FileText,
    color: "blue",
    placeholder: "What topic would you like your blog article to cover?",
  },
  {
    id: "product",
    title: "Product Description",
    description: "Write persuasive descriptions that help products sell.",
    icon: ShoppingBag,
    color: "orange",
    placeholder: "Enter the product name and its key features...",
  },
];
