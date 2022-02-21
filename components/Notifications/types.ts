import {
  ChatAlt2Icon,
  ChatIcon,
  ThumbUpIcon,
} from "react-native-heroicons/outline";

export const notifications = [
  {
    type: "comment",
    message: "a commenté votre publication",
    icon: {
      className: "bg-green-100 text-green-700",
      component: ChatIcon,
    },
  },
  {
    type: "message",
    message: "a envoyé un message",
    icon: {
      className: "bg-blue-100 text-blue-700",
      component: ChatAlt2Icon,
    },
  },
  {
    type: "like",
    message: "a aimé votre publication",
    icon: {
      className: "bg-green-100 text-green-700",
      component: ThumbUpIcon,
    },
  },
];
