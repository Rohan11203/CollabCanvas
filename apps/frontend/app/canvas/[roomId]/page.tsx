import { RoomCanvas } from "@/components/RoomCanvas";

// This comment tells ESLint to ignore the 'no-explicit-any' rule for the next line
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CanvasPage({ params }: any) {
  // Access params directly without 'await'
  const roomId = params.roomId;

  return <RoomCanvas roomId={roomId} />;
}
