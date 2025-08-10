import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import {
  getStreamToken,
  suggestReplies,
  suggestIcebreakers,
} from "../config/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import SmartReplies from "../components/SmartReplies";
import TopicStarters from "../components/TopicStarters";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [topicLoading, setTopicLoading] = useState(false);
  const [topics, setTopics] = useState([]);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.streamToken || !authUser) return;

      try {
        console.log("Initializing stream chat client...");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.streamToken
        );

        //
        const channelId = [authUser._id, targetUserId].sort().join("-");
        console.log("Channel ID:", channelId);

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });
        console.log("Current Channel:", currChannel);

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  const handleSuggest = async () => {
    if (!channel || !authUser) return;
    try {
      setAiLoading(true);
      // build last 10 messages with roles
      const msgs = (channel.state?.messages || [])
        .filter((m) => !m.deleted_at && typeof m.text === "string")
        .slice(-10)
        .map((m) => ({
          role: m.user?.id === authUser._id ? "me" : "friend",
          content: m.text,
        }));

      const { suggestions } = await suggestReplies(msgs);
      setAiSuggestions(suggestions || []);
    } catch (e) {
      console.error(e);
      toast.error("Couldn't get suggestions right now.");
    } finally {
      setAiLoading(false);
    }
  };

  const handlePick = async (text) => {
    if (!channel) return;
    try {
      // Send directly to the conversation
      await channel.sendMessage({ text });
      setAiSuggestions([]);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't send message.");
    }
  };

  const handleTopicSuggest = async () => {
    if (!targetUserId) return;
    try {
      setTopicLoading(true);
      const { topics } = await suggestIcebreakers(targetUserId);
      setTopics(topics || []);
    } catch (e) {
      console.error(e);
      toast.error("Couldn't get topics right now.");
    } finally {
      setTopicLoading(false);
    }
  };

  const handleTopicPick = async (text) => {
    if (!channel) return;
    try {
      await channel.sendMessage({ text });
      setTopics([]);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't send message.");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <SmartReplies
              onSuggest={handleSuggest}
              suggestions={aiSuggestions}
              onPick={handlePick}
              loading={aiLoading}
            />
            <TopicStarters
              onSuggest={handleTopicSuggest}
              topics={topics}
              onPick={handleTopicPick}
              loading={topicLoading}
            />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
export default ChatPage;
