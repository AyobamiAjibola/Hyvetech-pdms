import React, {ErrorInfo, ReactNode} from "react";
import {Navigate} from "react-router-dom";
import {IComponentErrorState} from "@app-interfaces";

interface Props {
    children?: ReactNode;
}

function withErrorBoundary(Component: () => JSX.Element) {
    return class WithErrorBoundary extends React.Component<Props,
        IComponentErrorState> {
        public state: IComponentErrorState = {
            hasError: false,
            errorMessage: "",
        };

        public static getDerivedStateFromError(error: Error): IComponentErrorState {
            // Update state so the next render will show the fallback UI.
            return {hasError: true, errorMessage: error.message};
        }

        public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
            console.error("Uncaught error:", error, errorInfo.componentStack);
            this.setState({hasError: true, errorMessage: error.message});
        }

        public render() {
            if (this.state.hasError) {
                return <Navigate to="/error" state={{...this.state}}/>;
            } else return <Component/>;
        }
    };
}

export default withErrorBoundary;
