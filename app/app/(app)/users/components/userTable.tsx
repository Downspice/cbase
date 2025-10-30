/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import {
  User,
  Mail,
  Briefcase,
  Activity,
  Calendar,
  Shield,
  MoreHorizontal,
  Eye,
  LogIn,
  Trash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdvancedDataTable } from "@/components/customUI/advanced-data-table";
import ViewUser from "./viewUserSheet";

// Sample user data type
interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  joinedDate: string;
  twoFactorAuth: "Enabled" | "Disabled";
  avatar: string;
  loginType:
    | "Email"
    | "Google"
    | "Facebook"
    | "Twitter"
    | "LinkedIn"
    | "GitHub"
    | "Microsoft";
}

// Login type icon mapping
const getLoginIcon = (loginType: string) => {
  const iconClass = "h-4 w-4";
  switch (loginType) {
    case "Google":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      );
    case "Facebook":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "Twitter":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="#1DA1F2">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      );
    case "LinkedIn":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "GitHub":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="#181717">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      );
    case "Microsoft":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.4 0H0v11.4h11.4V0z" fill="#F25022" />
          <path d="M24 0H12.6v11.4H24V0z" fill="#7FBA00" />
          <path d="M11.4 12.6H0V24h11.4V12.6z" fill="#00A4EF" />
          <path d="M24 12.6H12.6V24H24V12.6z" fill="#FFB900" />
        </svg>
      );
    case "Email":
    default:
      return <Mail className={iconClass} />;
  }
};

const handleRowClick = (row: any) => {
  console.log("Row clicked:", row.original);
};

const handleCellClick = (cell: any, row: any) => {
  console.log("Cell clicked:", cell.column.id, row.original);
};

const handlePrintSelected = (rows: any[]) => {
  console.log(
    "Print selected:",
    rows.map((r) => r.original)
  );
  alert(`Printing ${rows.length} selected rows`);
};

const handleEmailSelected = (rows: any[]) => {
  console.log(
    "Email selected:",
    rows.map((r) => r.original)
  );
  alert(`Emailing ${rows.length} selected rows`);
};

const handleDeleteRow = (id: string) => {
  // setData((prev) => prev.filter((item) => item.id !== id));
};

const handleDeleteSelected = (rows: any[]) => {
  console.log(
    "Delete selected:",
    rows.map((r) => r.original)
  );
  if (confirm(`Are you sure you want to delete ${rows.length} rows?`)) {
    const idsToDelete = rows.map((r) => r.original.id);
    // setData((prev) => prev.filter((item) => !idsToDelete.includes(item.id)));
  }
};

// Generate sample data with 30 users
const generateSampleData = (): UserData[] => {
  return [
    {
      id: "1",
      name: "Liam Smith",
      email: "smith@example.com",
      role: "Project Manager",
      status: "Active",
      joinedDate: "24 Jun 2024, 9:23 pm",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "Email",
    },
    {
      id: "2",
      name: "Noah Anderson",
      email: "anderson@example.com",
      role: "UX Designer",
      status: "Active",
      joinedDate: "15 Mar 2023, 2:45 pm",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "Google",
    },
    {
      id: "3",
      name: "Isabella Garcia",
      email: "garcia@example.com",
      role: "Front-End Developer",
      status: "Inactive",
      joinedDate: "10 Apr 2022, 11:30 am",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "GitHub",
    },
    {
      id: "4",
      name: "William Clark",
      email: "clark@example.com",
      role: "Product Owner",
      status: "Active",
      joinedDate: "28 Feb 2023, 6:15 pm",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "Microsoft",
    },
    {
      id: "5",
      name: "James Hall",
      email: "hall@example.com",
      role: "Business Analyst",
      status: "Active",
      joinedDate: "19 May 2024, 7:55 am",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "LinkedIn",
    },
    {
      id: "6",
      name: "Benjamin Lewis",
      email: "lewis@example.com",
      role: "Data Analyst",
      status: "Active",
      joinedDate: "03 Jan 2024, 12:05 pm",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "Google",
    },
    {
      id: "7",
      name: "Amelia Davis",
      email: "davis@example.com",
      role: "UX Designer",
      status: "Inactive",
      joinedDate: "21 Jul 2023, 8:40 pm",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "Facebook",
    },
    {
      id: "8",
      name: "Emma Johnson",
      email: "johnson@example.com",
      role: "UX Designer",
      status: "Active",
      joinedDate: "16 Sep 2023, 3:25 pm",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "Twitter",
    },
    {
      id: "9",
      name: "Olivia Brown",
      email: "brown@example.com",
      role: "Marketing Specialist",
      status: "Active",
      joinedDate: "04 Nov 2022, 9:50 am",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "Email",
    },
    {
      id: "10",
      name: "Ava Williams",
      email: "williams@example.com",
      role: "Software Engineer",
      status: "Active",
      joinedDate: "30 Dec 2023, 4:35 pm",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "GitHub",
    },
    {
      id: "11",
      name: "Sophia Jones",
      email: "jones@example.com",
      role: "Front-End Developer",
      status: "Active",
      joinedDate: "05 Jun 2023, 7:10 pm",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "Google",
    },
    {
      id: "12",
      name: "Mia Miller",
      email: "miller@example.com",
      role: "Security Analyst",
      status: "Inactive",
      joinedDate: "12 Aug 2022, 1:00 pm",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "Microsoft",
    },
    {
      id: "13",
      name: "Lucas Young",
      email: "young@example.com",
      role: "Front-End Developer",
      status: "Active",
      joinedDate: "17 Oct 2023, 10:20 am",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "LinkedIn",
    },
    {
      id: "14",
      name: "Alexander Wright",
      email: "wright@example.com",
      role: "DevOps Engineer",
      status: "Active",
      joinedDate: "08 Feb 2023, 5:45 pm",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "GitHub",
    },
    {
      id: "15",
      name: "Harper Martinez",
      email: "martinez@example.com",
      role: "System Architect",
      status: "Active",
      joinedDate: "27 Jul 2024, 6:30 am",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "Email",
    },
    {
      id: "16",
      name: "Ethan Thompson",
      email: "thompson@example.com",
      role: "Backend Developer",
      status: "Active",
      joinedDate: "14 Jan 2024, 3:15 pm",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "Google",
    },
    {
      id: "17",
      name: "Charlotte Wilson",
      email: "wilson@example.com",
      role: "QA Engineer",
      status: "Active",
      joinedDate: "22 Apr 2023, 11:20 am",
      twoFactorAuth: "Disabled",
      avatar: "/avatar.JPG",
      loginType: "Facebook",
    },
    {
      id: "18",
      name: "Mason Taylor",
      email: "taylor@example.com",
      role: "Full Stack Developer",
      status: "Inactive",
      joinedDate: "09 Nov 2022, 2:30 pm",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "Twitter",
    },
    {
      id: "19",
      name: "Amelia Moore",
      email: "moore@example.com",
      role: "Product Designer",
      status: "Active",
      joinedDate: "18 May 2024, 9:45 am",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "LinkedIn",
    },
    {
      id: "20",
      name: "Logan Jackson",
      email: "jackson@example.com",
      role: "Data Scientist",
      status: "Active",
      joinedDate: "07 Dec 2023, 4:00 pm",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "GitHub",
    },
    {
      id: "21",
      name: "Ella Martin",
      email: "martin@example.com",
      role: "UI Designer",
      status: "Active",
      joinedDate: "25 Feb 2023, 10:10 am",
      twoFactorAuth: "Disabled",
      avatar: "/avatar.JPG",
      loginType: "Microsoft",
    },
    {
      id: "22",
      name: "Sebastian Lee",
      email: "lee@example.com",
      role: "Cloud Engineer",
      status: "Active",
      joinedDate: "13 Aug 2024, 1:35 pm",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "Email",
    },
    {
      id: "23",
      name: "Scarlett White",
      email: "white@example.com",
      role: "Scrum Master",
      status: "Inactive",
      joinedDate: "30 Jun 2022, 8:20 am",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "Google",
    },
    {
      id: "24",
      name: "Jack Harris",
      email: "harris@example.com",
      role: "Mobile Developer",
      status: "Active",
      joinedDate: "11 Mar 2024, 5:50 pm",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "GitHub",
    },
    {
      id: "25",
      name: "Grace Clark",
      email: "gclark@example.com",
      role: "Technical Writer",
      status: "Active",
      joinedDate: "29 Sep 2023, 12:40 pm",
      twoFactorAuth: "Disabled",
      avatar: "/avatar.JPG",
      loginType: "Facebook",
    },
    {
      id: "26",
      name: "Henry Rodriguez",
      email: "rodriguez@example.com",
      role: "DevOps Lead",
      status: "Active",
      joinedDate: "16 Jan 2023, 7:25 am",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "LinkedIn",
    },
    {
      id: "27",
      name: "Lily Lewis",
      email: "llewis@example.com",
      role: "Product Manager",
      status: "Active",
      joinedDate: "03 Oct 2024, 3:05 pm",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "Microsoft",
    },
    {
      id: "28",
      name: "Daniel Walker",
      email: "walker@example.com",
      role: "Security Engineer",
      status: "Inactive",
      joinedDate: "20 May 2022, 6:15 pm",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "Twitter",
    },
    {
      id: "29",
      name: "Aria Hall",
      email: "ahall@example.com",
      role: "AI Engineer",
      status: "Active",
      joinedDate: "08 Jul 2024, 11:50 am",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "Email",
    },
    {
      id: "30",
      name: "Michael Allen",
      email: "allen@example.com",
      role: "Solutions Architect",
      status: "Active",
      joinedDate: "15 Nov 2023, 2:20 pm",
      twoFactorAuth: "Enabled",
      avatar: "/avatar.JPG",
      loginType: "Google",
    },
  ];
};

export default function DataTableExample() {
  const [data, setData] = React.useState<UserData[]>(generateSampleData());

  // Define columns with icons
  const columns: ExtendedColumnDef<UserData>[] = [
    {
      accessorKey: "name",
      header: "Full name",
      headerIcon: <User className="h-4 w-4" />,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            <img
              src={row.original.avatar}
              alt={row.getValue("name")}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  const initials = (row.getValue("name") as string)
                    .split(" ")
                    .map((n) => n[0])
                    .join("");
                  const fallback = document.createElement("div");
                  fallback.className =
                    "w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium";
                  fallback.textContent = initials;
                  parent.insertBefore(fallback, target);
                }
              }}
            />
            <span className="font-medium">{row.getValue("name")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      headerIcon: <Mail className="h-4 w-4" />,
      cell: ({ row }) => {
        return (
          <a
            href={`mailto:${row.getValue("email")}`}
            className="text-blue-600 hover:underline"
          >
            {row.getValue("email")}
          </a>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      headerIcon: <Briefcase className="h-4 w-4" />,
      cell: ({ row }) => {
        return (
          <span className="text-muted-foreground">{row.getValue("role")}</span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      headerIcon: <Activity className="h-4 w-4" />,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                status === "Active" ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-muted-foreground">{status}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "loginType",
      header: "Login Type",
      headerIcon: <LogIn className="h-4 w-4" />,
      cell: ({ row }) => {
        const loginType = row.getValue("loginType") as string;
        return (
          <div className="flex items-center gap-2">
            {getLoginIcon(loginType)}
            <span className="text-muted-foreground">{loginType}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "joinedDate",
      header: "Joined date",
      headerIcon: <Calendar className="h-4 w-4" />,
      cell: ({ row }) => {
        return (
          <span className="text-muted-foreground">
            {row.getValue("joinedDate")}
          </span>
        );
      },
    },
    {
      accessorKey: "twoFactorAuth",
      header: "2F Auth",
      headerIcon: <Shield className="h-4 w-4" />,
      cell: ({ row }) => {
        const auth = row.getValue("twoFactorAuth") as string;
        return (
          <Badge
            variant="secondary"
            className={
              auth === "Enabled"
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                : "bg-gray-100 text-gray-600 hover:bg-gray-100"
            }
          >
            {auth}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      headerIcon: <MoreHorizontal className="h-4 w-4" />,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <ViewUser>
              <Button
                variant="success"
                size="sm"
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
                // onClick={(e) => {
                //   e.stopPropagation();
                //   console.log("View:", row.original);
                //   alert(`Viewing details for ${row.original.name}`);
                // }}
              >
                <Eye className="h-4 w-4 " />
              </Button>
            </ViewUser>

            <Button
              variant="destructive"
              size="sm"
              // className="h-8 px-2 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                if (
                  confirm(
                    `Are you sure you want to delete ${row.original.name}?`
                  )
                ) {
                  handleDeleteRow(row.original.id);
                }
              }}
            >
              <Trash className="h-4 w-4 " />
            </Button>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage your team members and their account permissions
        </p>
      </div>

      <AdvancedDataTable
        columns={columns}
        data={data}
        onRowClick={handleRowClick}
        onCellClick={handleCellClick}
        storageKey="user-table-visibility"
        defaultVisibleColumns={[
          "name",
          "email",
          "role",
          "status",
          "loginType",
          "joinedDate",
          "twoFactorAuth",
          "actions",
        ]}
        onPrintSelected={handlePrintSelected}
        onEmailSelected={handleEmailSelected}
        onDeleteSelected={handleDeleteSelected}
      />
    </div>
  );
}
