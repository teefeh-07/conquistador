import { describe, it, expect, beforeEach } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;

describe('Conquistador Transaction Tests', () => {
  beforeEach(() => {
    // Setup runs before each test
  });

  it('should create a transaction successfully', () => {
    const { result } = simnet.callPublicFn(
      'Conquistador',
      'create-transaction',
      [Cl.principal(wallet2), Cl.uint(1000000)],
      wallet1
    );
    expect(result).toBeOk(Cl.uint(1));
  });

  it('should fail if recipient is invalid', () => {
    const { result } = simnet.callPublicFn(
      'Conquistador',
      'create-transaction',
      [Cl.principal(wallet1), Cl.uint(1000000)],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(3)); // ERR-INVALID-RECIPIENT
  });

  it('should fail if amount is zero', () => {
    const { result } = simnet.callPublicFn(
      'Conquistador',
      'create-transaction',
      [Cl.principal(wallet2), Cl.uint(0)],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(2)); // ERR-INSUFFICIENT-FUNDS
  });

  it('should release funds successfully', () => {
    // First create a transaction
    simnet.callPublicFn(
      'Conquistador',
      'create-transaction',
      [Cl.principal(wallet2), Cl.uint(1000000)],
      wallet1
    );

    // Then release funds
    const { result } = simnet.callPublicFn(
      'Conquistador',
      'release-funds',
      [Cl.uint(1)],
      wallet1
    );
    expect(result).toBeOk(Cl.bool(true));
  });

  it('should fail if caller is not sender', () => {
    // Create transaction as wallet1
    simnet.callPublicFn(
      'Conquistador',
      'create-transaction',
      [Cl.principal(wallet2), Cl.uint(1000000)],
      wallet1
    );

    // Try to release as wallet2
    const { result } = simnet.callPublicFn(
      'Conquistador',
      'release-funds',
      [Cl.uint(1)],
      wallet2
    );
    expect(result).toBeErr(Cl.uint(1)); // ERR-UNAUTHORIZED
  });

  it('should fail if transaction id is invalid', () => {
    const { result } = simnet.callPublicFn(
      'Conquistador',
      'release-funds',
      [Cl.uint(999)],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(6)); // ERR-INVALID-TRANSACTION-ID
  });

  it('should raise dispute successfully', () => {
    // Create transaction
    simnet.callPublicFn(
      'Conquistador',
      'create-transaction',
      [Cl.principal(wallet2), Cl.uint(1000000)],
      wallet1
    );

    // Raise dispute
    const { result } = simnet.callPublicFn(
      'Conquistador',
      'raise-dispute',
      [Cl.uint(1)],
      wallet1
    );
    expect(result).toBeOk(Cl.bool(true));
  });

  it('should fail if caller is not authorized to dispute', () => {
    // Create transaction between wallet1 and wallet2
    simnet.callPublicFn(
      'Conquistador',
      'create-transaction',
      [Cl.principal(wallet2), Cl.uint(1000000)],
      wallet1
    );

    // Try to dispute as deployer (not involved)
    const { result } = simnet.callPublicFn(
      'Conquistador',
      'raise-dispute',
      [Cl.uint(1)],
      deployer
    );
    expect(result).toBeErr(Cl.uint(1)); // ERR-UNAUTHORIZED
  });
});
