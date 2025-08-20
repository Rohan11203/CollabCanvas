import { RoomCanvas } from "@/components/RoomCanvas";

export default function CanvasPage({
  params,
}: {
  params: {
    roomId: string;
  };
}) {
  // Access params directly without 'await'
  const roomId = params.roomId;

  return <RoomCanvas roomId={roomId} />;
}