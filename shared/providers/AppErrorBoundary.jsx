"use client";

import { Component } from "react";
import { StatusPanel } from "@/shared/ui";

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error) {
    console.error("App error boundary caught an error:", error);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <StatusPanel
          kicker="Client error"
          title="A client-side error interrupted this page."
          description={this.state.error?.message || "Unexpected error."}
          actionLabel="Try Again"
          onAction={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}