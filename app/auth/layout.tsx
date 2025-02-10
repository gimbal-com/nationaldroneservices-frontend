import { FC, ReactNode } from "react";

const AuthLayout: FC<{children: ReactNode}> = ({children}) => {
    return (
        <div className="bg-white w-full h-screen flex items-center justify-center">
            {children}
        </div>
    )
}

export default AuthLayout;