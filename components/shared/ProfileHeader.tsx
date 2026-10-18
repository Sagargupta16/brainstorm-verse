import Image from "next/image";
import Link from "next/link";

interface Props {
  name: string;
  username: string;
  image: string;
  bio: string;
  isOwner: boolean;
  stats: { ideas: number; replies: number; upvotes: number };
}

function ProfileHeader({
  name,
  username,
  image,
  bio,
  isOwner,
  stats,
}: Readonly<Props>) {
  const statItems = [
    { label: "Ideas", value: stats.ideas },
    { label: "Replies", value: stats.replies },
    { label: "Upvotes", value: stats.upvotes },
  ];

  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-20 w-20 shrink-0">
            <Image
              src={image}
              alt={name}
              fill
              sizes="80px"
              className="rounded-full object-cover shadow-2xl"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="truncate text-base-medium text-gray-1">@{username}</p>
          </div>
        </div>
        {isOwner && (
          <Link
            href="/profile/edit"
            className="flex shrink-0 items-center gap-2 rounded-lg bg-dark-3 px-4 py-2"
          >
            <Image src="/assets/edit.svg" alt="" width={16} height={16} />
            <span className="text-small-medium text-light-2 max-sm:hidden">
              Edit
            </span>
          </Link>
        )}
      </div>

      <p className="mt-6 max-w-lg whitespace-pre-line text-base-regular text-light-2">
        {bio}
      </p>

      <dl className="mt-6 grid grid-cols-3 gap-3">
        {statItems.map((item) => (
          <div key={item.label} className="rounded-lg bg-dark-2 px-3 py-3">
            <dt className="text-subtle-medium text-gray-1">{item.label}</dt>
            <dd className="mt-1 text-heading4-medium tabular-nums text-light-1">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 h-0.5 w-full bg-dark-3" />
    </div>
  );
}

export default ProfileHeader;
