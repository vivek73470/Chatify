export const formatTime = (date) => {
    if (!date) return "";

    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
        return messageDate.toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    if (messageDate.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    }

    return messageDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
    });
};


export const getInitials = (name) => {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export const formatMessageTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};
