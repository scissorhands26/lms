import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

export default function SettingsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Settings</h1>
      </div>
      <div className="border shadow-sm rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">General Settings</h2>
        <form className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="school-name">School Name</Label>
            <Input
              id="school-name"
              placeholder="Enter school name"
              type="text"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="school-address">School Address</Label>
            <Textarea id="school-address" placeholder="Enter school address" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="school-phone">School Phone</Label>
            <Input
              id="school-phone"
              placeholder="Enter school phone number"
              type="tel"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="school-email">School Email</Label>
            <Input
              id="school-email"
              placeholder="Enter school email"
              type="email"
            />
          </div>
          <Button className="w-full" type="submit">
            Save Settings
          </Button>
        </form>
      </div>
      <div className="border shadow-sm rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">User Management</h2>
        <form className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="admin-name">Admin Name</Label>
            <Input id="admin-name" placeholder="Enter admin name" type="text" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="admin-email">Admin Email</Label>
            <Input
              id="admin-email"
              placeholder="Enter admin email"
              type="email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="admin-password">Admin Password</Label>
            <Input
              id="admin-password"
              placeholder="Enter admin password"
              type="password"
            />
          </div>
          <Button className="w-full" type="submit">
            Update Admin Account
          </Button>
        </form>
      </div>
      <div className="border shadow-sm rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        <form className="grid gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="new-enrollment-notifications" />
            <Label htmlFor="new-enrollment-notifications">
              New Enrollment Notifications
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="assignment-due-notifications" />
            <Label htmlFor="assignment-due-notifications">
              Assignment Due Notifications
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="grade-update-notifications" />
            <Label htmlFor="grade-update-notifications">
              Grade Update Notifications
            </Label>
          </div>
          <Button className="w-full" type="submit">
            Save Notification Settings
          </Button>
        </form>
      </div>
      <div className="border shadow-sm rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Integrations</h2>
        <form className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="lms-integration">LMS Integration</Label>
            <Select id="lms-integration">
              <option value="">Select LMS</option>
              <option value="canvas">Canvas</option>
              <option value="blackboard">Blackboard</option>
              <option value="moodle">Moodle</option>
              <option value="d2l">D2L</option>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="payment-integration">Payment Integration</Label>
            <Select id="payment-integration">
              <option value="">Select Payment Gateway</option>
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="braintree">Braintree</option>
            </Select>
          </div>
          <Button className="w-full" type="submit">
            Save Integration Settings
          </Button>
        </form>
      </div>
    </main>
  );
}
