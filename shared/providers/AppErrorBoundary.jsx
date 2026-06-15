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
    console.error(error);
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
          kicker="Something went wrong"
          title="This part of the page crashed."
          description={this.state.error?.message || "Please try again."}
          actionLabel="Try again"
          onAction={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}