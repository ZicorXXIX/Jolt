interface Room {
  id: number;
  name: string;
}

export default function Rooms({ room }: { room: Room[] }) {
  return (
    <div className="flex flex-col items-center space-y-4">
      {room.map((room) => (
        <div key={room.id}>
          <button className="w-full bg-black text-white font-bold py-2 px-4 rounded-md transition-all duration-300 hover:bg-gray-800">
            {room.name}
          </button>
        </div>
      ))}
    </div>
  );
}
