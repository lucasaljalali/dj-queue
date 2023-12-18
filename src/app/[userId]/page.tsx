"use client";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { IMusic } from "../global";

export default function UserListToVote({ params }: { params: { userId: string } }) {
  const [data, setData] = useState<IMusic[]>([] as IMusic[]);
  const userId = params.userId;

  useEffect(() => {
    if (userId) {
      const q = query(collection(db, "musics"), where("user", "==", userId));

      onSnapshot(q, (querySnapshot) => {
        let musicsArray: IMusic[] = [];

        querySnapshot.forEach((doc) => {
          musicsArray.push({ ...doc.data(), id: doc.id } as IMusic);
        });

        setData(musicsArray);
      });
    }
  }, [userId]);

  useEffect(() => {
    console.log({ data });
  }, [data]);

  return <h1>{params.userId}</h1>;
}
