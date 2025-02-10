import { FC } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
    CardTitle
} from "@/components/ui/card";
import Image from "next/image";

import Logo from "../../../assets/images/logo.png";
import { Input } from "@/components/ui/input";

const LoginPage: FC = () => {
    return (
        <Card className="w-96">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <Image src={Logo} width={200} height={100} alt="Logo" />
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3">
                    <Input placeholder="Username" />
                    <Input placeholder="Password" />
                </div>
            </CardContent>
            <CardFooter>

            </CardFooter>
        </Card>
    )
}

export default LoginPage;