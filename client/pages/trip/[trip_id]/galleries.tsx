import Layout from "@/components/common/Layout";
import LayoutGrid from "@/components/ui/layout-grid";
import { useUser } from "@/hooks/use-user";
import { imageServer } from "@/lib/const";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function galleries() {
    const [cards, setCards] = useState([]);
    const [user, _] = useUser();
    const router = useRouter();

    useEffect(() => {
        if(!user?._id || !router.query?.trip_id) return;
        fetch(`${imageServer}/images?user_id=${user?._id}&album_id=${router.query?.trip_id}`)
        .then(res => res.json())
        .then(data => {
            setCards(cs => {
                return data?.images?.map((d:string, i:number) => {
                    return {
                        id: i,
                        content: "",
                        className: "",
                        thumbnail: imageServer + "/" + d,
                    }
                }) || [];
            })
        }).catch(err => {
            console.log(err);
        });
    }, [router.query?.trip_id, user?._id]);

  return (
    <Layout>
        <LayoutGrid cards={[
            {
                type: 'add',
                className: "",
                thumbnail: "",
                content: "",
                id: 0
            },
            ...cards
        ]}/>
    </Layout>
  )
}
