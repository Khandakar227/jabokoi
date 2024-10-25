
import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { div } from "framer-motion/client";
import { imageServer } from "@/lib/const";
import Spinner from "../common/Spinner";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/use-user";

type Card = {
  id: number;
  content: JSX.Element | React.ReactNode | string;
  className: string;
  thumbnail: string;
  type?: string;
};


const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null);
  const [lastSelected, setLastSelected] = useState<Card | null>(null);
  const [_cards, setCards] = useState(cards);
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const [user, _] = useUser();

  useEffect(() => {
    setCards(cards);
  }, [cards]);
  
  const handleClick = (card: Card) => {
    setLastSelected(selected);
    setSelected(card);
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

  const handleFileUpload = () => {
    fileUploadRef.current?.click();
  }

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    setLoading(true);

    if (!file || !user?._id || !router.query.trip_id) return;
    const form = new FormData();
    form.append("user_id", user?._id as string);
    form.append("album_id", router.query.trip_id as string);
    form.append("image", file);
    fetch(imageServer + "/add_image", {
      method: "POST",
      body: form
    })
    .then(res => res.json())
    .then(res => {
      setCards(cs => {
        cs.push({
          id: cs.length + 1,
          content: "",
          className: "",
          thumbnail: imageServer + "/" + res.image_path,
        });
        return cs;
      });
      }).finally(() => {
      setLoading(false);
    });
  }
  
  return (
    <div className="w-full p-10 grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-4 relative min-h-[100vh]">
      {_cards?.map((card, i) => (
        !card.type ?
        <div key={i} className={cn(card.className, "")}>
          <motion.div
            onClick={() => handleClick(card)}
            className={cn(
              card.className,
              "relative overflow-hidden",
              selected?.id === card.id
                ? "rounded-lg cursor-pointer absolute inset-0 h-1/2 w-full md:w-1/2 m-auto z-50 flex justify-center items-center flex-wrap flex-col"
                : lastSelected?.id === card.id
                ? "z-40 bg-white rounded-xl h-full w-full"
                : "bg-white rounded-xl h-full w-full"
            )}
            layoutId={`card-${card.id}`}
          >
            {selected?.id === card.id && <SelectedCard selected={selected} />}
            <ImageComponent card={card} />
          </motion.div>
        </div>
        :
        <div key={i} className={cn(card.className, "")}>
          <div onClick={handleFileUpload} className={cn(
                card.className, "relative overflow-hidden bg-blue-500 rounded-xl h-full w-full flex justify-center items-center cursor-pointer min-h-[300px]"
              )}>
                {
                  loading ? <Spinner/> : <div className="text-white text-2xl">+</div>
                }
          </div>
          <input type="file" name="image" id="image" className="hidden" ref={fileUploadRef} onChange={onFileUpload} />
        </div>
      ))}

      <motion.div
        onClick={handleOutsideClick}
        className={cn(
          "absolute h-full w-full left-0 top-0 bg-black opacity-0 z-10 py-12",
          selected?.id ? "pointer-events-auto" : "pointer-events-none"
        )}
        animate={{ opacity: selected?.id ? 0.3 : 0 }}
      />
    </div>
  );
};

const ImageComponent = ({ card }: { card: Card }) => {
  return (
    <motion.img
      layoutId={`image-${card.id}-image`}
      src={card.thumbnail}
      height="500"
      width="500"
      className={cn(
        "object-cover absolute inset-0 h-full w-full transition duration-200"
      )}
      alt="thumbnail"
    />
  );
};

const SelectedCard = ({ selected }: { selected: Card | null }) => {
  return (
    <div className="bg-transparent h-full w-full flex flex-col justify-end rounded-lg shadow-2xl relative z-[60]">
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 0.6,
        }}
        className="absolute inset-0 h-full w-full z-10"
      />
      <motion.div
        layoutId={`content-${selected?.id}`}
        initial={{
          opacity: 0,
          y: 100,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: 100,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="relative px-8 pb-4 z-[70]"
      >
        {selected?.content}
      </motion.div>
    </div>
  );
};

export default LayoutGrid;