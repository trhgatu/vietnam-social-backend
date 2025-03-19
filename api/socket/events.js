// Các sự kiện liên quan đến chat
export const chatEvents = (io, socket) => {
  socket.on('join:chat', (chatId) => {
    socket.join(`chat:${chatId}`);
  });

  socket.on('send:message', (data) => {
    const { chatId, message } = data;
    io.to(`chat:${chatId}`).emit('new:message', {
      chatId,
      message,
      sender: socket.user.id,
      timestamp: new Date()
    });
  });

  socket.on('mark:read', (data) => {
    const { chatId, messageId } = data;
    io.to(`chat:${chatId}`).emit('message:read', {
      chatId,
      messageId,
      reader: socket.user.id
    });
  });
};


export const notificationEvents = (io, socket) => {
  socket.on('send:notification', (data) => {
    const { userId, notification } = data;
    io.to(`user:${userId}`).emit('new:notification', {
      notification,
      timestamp: new Date()
    });
  });

  socket.on('mark:notification:read', (notificationId) => {
    io.to(`user:${socket.user.id}`).emit('notification:read', {
      notificationId,
      timestamp: new Date()
    });
  });
};

export const postEvents = (io, socket) => {
  socket.on('create:post', (post) => {
    io.emit('new:post', {
      post,
      author: socket.user.id,
      timestamp: new Date()
    });
  });

  socket.on('toggle:like', (data) => {
    const { postId, action } = data;
    io.emit('post:like:update', {
      postId,
      userId: socket.user.id,
      action,
      timestamp: new Date()
    });
  });


  socket.on('add:comment', (data) => {
    const { postId, comment } = data;
    io.emit('new:comment', {
      postId,
      comment,
      author: socket.user.id,
      timestamp: new Date()
    });
  });
};


export const friendEvents = (io, socket) => {

  socket.on('send:friend:request', (data) => {
    const { userId } = data;
    io.to(`user:${userId}`).emit('new:friend:request', {
      sender: socket.user.id,
      timestamp: new Date()
    });
  });


  socket.on('respond:friend:request', (data) => {
    const { userId, action } = data;
    io.to(`user:${userId}`).emit('friend:request:response', {
      userId: socket.user.id,
      action,
      timestamp: new Date()
    });
  });
};