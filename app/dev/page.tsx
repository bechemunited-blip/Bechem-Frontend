"use client";

import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Checkbox from "@/components/ui/Checkbox";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Icon } from "@iconify/react";

export default function ComponentShowcasePage() {
  const [inputValue, setInputValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  return (
    <main className="container-wide py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-text mb-2">
          Component Showcase
        </h1>
        <p className="text-neutral-6 mb-10">
          Development page for testing UI components
        </p>

        {/* Input Components Section */}
        <Card variant="elevated" padding="lg" cardClassName="mb-8">
          <h2 className="text-2xl font-bold text-neutral-text mb-6">
            Input Components
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Default Input */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Default Input</h3>
              <Input
                label="Email Address"
                inputType="email"
                placeholder="Enter your email"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                fullWidth
                required
              />
            </div>

            {/* Input with Icon */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Input with Icons</h3>
              <Input
                label="Search"
                inputType="search"
                placeholder="Search..."
                leftIcon={<Icon icon="mdi:magnify" width="20" height="20" />}
                fullWidth
              />
            </div>

            {/* Input with Error */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Input with Error</h3>
              <Input
                label="Username"
                placeholder="Enter username"
                error="Username is already taken"
                fullWidth
              />
            </div>

            {/* Filled Variant */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Filled Variant</h3>
              <Input
                variant="filled"
                label="Full Name"
                placeholder="John Doe"
                helperText="Enter your full legal name"
                fullWidth
              />
            </div>
          </div>
        </Card>

        {/* Textarea Section */}
        <Card variant="elevated" padding="lg" cardClassName="mb-8">
          <h2 className="text-2xl font-bold text-neutral-text mb-6">
            Textarea Component
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Default Textarea</h3>
              <Textarea
                label="Message"
                placeholder="Enter your message..."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                fullWidth
                rows={4}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Filled Textarea</h3>
              <Textarea
                variant="filled"
                label="Comments"
                placeholder="Add your comments..."
                helperText="Maximum 500 characters"
                fullWidth
                rows={4}
              />
            </div>
          </div>
        </Card>

        {/* Select Section */}
        <Card variant="elevated" padding="lg" cardClassName="mb-8">
          <h2 className="text-2xl font-bold text-neutral-text mb-6">
            Select Component
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Default Select</h3>
              <Select
                label="Country"
                placeholder="Select a country"
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                options={[
                  { value: "gh", label: "Ghana" },
                  { value: "ng", label: "Nigeria" },
                  { value: "ke", label: "Kenya" },
                  { value: "za", label: "South Africa" },
                ]}
                fullWidth
                required
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Filled Select</h3>
              <Select
                variant="filled"
                label="Position"
                placeholder="Select position"
                options={[
                  { value: "gk", label: "Goalkeeper" },
                  { value: "def", label: "Defender" },
                  { value: "mid", label: "Midfielder" },
                  { value: "fwd", label: "Forward" },
                ]}
                fullWidth
              />
            </div>
          </div>
        </Card>

        {/* Checkbox Section */}
        <Card variant="elevated" padding="lg" cardClassName="mb-8">
          <h2 className="text-2xl font-bold text-neutral-text mb-6">
            Checkbox Component
          </h2>

          <div className="space-y-4">
            <Checkbox
              label="I agree to the terms and conditions"
              checked={checkboxChecked}
              onChange={(e) => setCheckboxChecked(e.target.checked)}
            />

            <Checkbox
              size="lg"
              label="Receive marketing emails"
              helperText="We'll send you updates about matches and news"
            />

            <Checkbox label="Subscribe to newsletter" disabled />
          </div>
        </Card>

        {/* Card Variants Section */}
        <Card variant="elevated" padding="lg" cardClassName="mb-8">
          <h2 className="text-2xl font-bold text-neutral-text mb-6">
            Card Variants
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card variant="default" hoverable padding="md">
              <h3 className="font-semibold mb-2">Default Card</h3>
              <p className="text-sm text-neutral-6">
                This is a default card with border
              </p>
            </Card>

            <Card variant="outlined" hoverable padding="md">
              <h3 className="font-semibold mb-2">Outlined Card</h3>
              <p className="text-sm text-neutral-6">
                This is an outlined card with thick border
              </p>
            </Card>

            <Card variant="elevated" hoverable padding="md">
              <h3 className="font-semibold mb-2">Elevated Card</h3>
              <p className="text-sm text-neutral-6">
                This is an elevated card with shadow
              </p>
            </Card>

            <Card variant="ghost" hoverable padding="md">
              <h3 className="font-semibold mb-2">Ghost Card</h3>
              <p className="text-sm text-neutral-6">
                This is a ghost card with no border
              </p>
            </Card>
          </div>
        </Card>

        {/* Button Section (Existing) */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-2xl font-bold text-neutral-text mb-6">
            Button Component (Existing)
          </h2>

          <div className="flex flex-wrap gap-4">
            <Button variant="primary" size="sm">
              Primary Small
            </Button>
            <Button variant="primary" size="md">
              Primary Medium
            </Button>
            <Button variant="primary" size="lg">
              Primary Large
            </Button>
            <Button variant="outline" size="md">
              Outline Button
            </Button>
            <Button variant="ghost" size="md">
              Ghost Button
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Icon icon="mdi:plus" width="20" height="20" />}
            >
              With Icon
            </Button>
            <Button variant="primary" size="md" disabled>
              Disabled
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
