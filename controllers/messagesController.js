import Messages from "../model/messageModel.js";

export const addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;

    const data = await Messages.create({
      message: { text: message },
      users: [to, from],
      sender: from,
    });

    if (data) {
      return res.json({ msg: "Message added." });
    }
    return res.json({ msg: "failed to add in database" });
  } catch (err) {
    next(err);
  }
};

export const getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};
