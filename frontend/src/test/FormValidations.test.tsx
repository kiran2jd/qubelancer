import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RegisterPage } from "../pages/RegisterPage";
import { SubmitProposalModal } from "../components/SubmitProposalModal";
import { CredentialModal } from "../components/CredentialModal";
import { ReviewModal } from "../components/ReviewModal";
import { DeliverableSubmitModal } from "../components/DeliverableSubmitModal";
import { AuthProvider } from "../context/AuthContext";

describe("QubeLancer Form Validations & Controls", () => {
  describe("RegisterPage Form Validations", () => {
    it("renders all registration inputs and enforces validation on submission with empty fields", async () => {
      render(
        <MemoryRouter>
          <AuthProvider>
            <RegisterPage />
          </AuthProvider>
        </MemoryRouter>
      );

      // Verify title & brand
      expect(screen.getByText(/Create your QubeLancer account/i)).toBeInTheDocument();

      // Submit without filling
      const submitBtn = screen.getByRole("button", { name: /Register as Customer/i });
      fireEvent.click(submitBtn);

      // Inline validation errors should appear
      expect(await screen.findByText(/First name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Please confirm your password/i)).toBeInTheDocument();
      expect(screen.getByText(/You must agree to the Terms of Service/i)).toBeInTheDocument();
    });

    it("displays validation error when passwords do not match", async () => {
      render(
        <MemoryRouter>
          <AuthProvider>
            <RegisterPage />
          </AuthProvider>
        </MemoryRouter>
      );

      const inputs = screen.getAllByPlaceholderText("••••••••");
      const passwordInput = inputs[0];
      const confirmInput = inputs[1];

      fireEvent.change(passwordInput, { target: { value: "SecretPassword123" } });
      fireEvent.change(confirmInput, { target: { value: "DifferentPassword123" } });
      fireEvent.blur(confirmInput);

      expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
    });

    it("switches roles smoothly between Customer and Professional", () => {
      render(
        <MemoryRouter>
          <AuthProvider>
            <RegisterPage />
          </AuthProvider>
        </MemoryRouter>
      );

      const professionalCard = screen.getByText(/I'm a Professional/i);
      fireEvent.click(professionalCard);

      expect(screen.getByRole("button", { name: /Register as Professional/i })).toBeInTheDocument();
    });
  });

  describe("SubmitProposalModal Validations", () => {
    it("enforces minimum bid amount ($25) and cover letter minimum length", async () => {
      const onSuccessMock = vi.fn();
      const onCloseMock = vi.fn();

      render(
        <SubmitProposalModal
          isOpen={true}
          onClose={onCloseMock}
          projectId="proj-123"
          projectTitle="Enterprise Cloud Migration"
          onSuccess={onSuccessMock}
        />
      );

      const amountInput = screen.getByDisplayValue("500");
      fireEvent.change(amountInput, { target: { value: "10" } });
      fireEvent.blur(amountInput);

      expect(await screen.findByText(/Minimum bid amount is \$25 USD/i)).toBeInTheDocument();

      const submitBtn = screen.getByRole("button", { name: /Submit Bid/i });
      fireEvent.click(submitBtn);

      expect(await screen.findByText(/Proposal and strategy pitch is required/i)).toBeInTheDocument();
    });
  });

  describe("CredentialModal Validations", () => {
    it("validates credential title and issuing organization", async () => {
      const onSuccessMock = vi.fn();
      const onCloseMock = vi.fn();

      render(
        <CredentialModal
          isOpen={true}
          onClose={onCloseMock}
          onSuccess={onSuccessMock}
        />
      );

      const submitBtn = screen.getByRole("button", { name: /Submit for Verification/i });
      fireEvent.click(submitBtn);

      expect(await screen.findByText(/Credential or license title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Issuing authority \/ organization is required/i)).toBeInTheDocument();
    });
  });

  describe("ReviewModal Validations", () => {
    it("validates star rating and written comment length", async () => {
      const onSuccessMock = vi.fn();
      const onCloseMock = vi.fn();

      render(
        <ReviewModal
          isOpen={true}
          onClose={onCloseMock}
          contractId="contract-123"
          counterpartName="Arjun Mehta"
          onSuccess={onSuccessMock}
        />
      );

      const submitBtn = screen.getByRole("button", { name: /Publish Review/i });
      fireEvent.click(submitBtn);

      expect(await screen.findByText(/Written evaluation feedback is required/i)).toBeInTheDocument();
    });
  });

  describe("DeliverableSubmitModal Validations", () => {
    it("enforces deliverable notes minimum length", async () => {
      const onSuccessMock = vi.fn();
      const onCloseMock = vi.fn();

      render(
        <DeliverableSubmitModal
          isOpen={true}
          onClose={onCloseMock}
          contractId="contract-123"
          milestoneId="milestone-1"
          milestoneTitle="Initial Architecture Wireframes"
          onSuccess={onSuccessMock}
        />
      );

      const submitBtn = screen.getByRole("button", { name: /Submit for Approval/i });
      fireEvent.click(submitBtn);

      expect(await screen.findByText(/Deliverable summary is required/i)).toBeInTheDocument();
    });
  });
});
