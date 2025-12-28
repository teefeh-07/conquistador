;; @contract Conquistador
;; @description Escrow and Reputation system with Dispute Resolution.
;; Conquistador: Decentralized Escrow and Reputation Management

(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-UNAUTHORIZED (err u1))
(define-constant ERR-INSUFFICIENT-FUNDS (err u2))
(define-constant ERR-INVALID-RECIPIENT (err u3))
(define-constant ERR-TRANSACTION-NOT-FOUND (err u4))
(define-constant ERR-INVALID-POINTS (err u5))
(define-constant ERR-INVALID-TRANSACTION-ID (err u6))
(define-constant ERR-DISPUTE-ALREADY-RAISED (err u7))
(define-private (is-arbitrator)
  (is-eq tx-sender (var-get arbitrator))
)
(define-constant ERR-NOT-ARBITRATOR (err u8))

;; Validate recipient is not the sender
(define-private (is-valid-recipient (recipient principal))
  (and
    (not (is-eq recipient tx-sender))
    (not (is-eq recipient CONTRACT-OWNER))
  )
)

;; Validate transaction ID
(define-private (is-valid-transaction-id (id uint))
  (and
    (> id u0)
    (< id (var-get next-transaction-id))
  )
)

;; Transaction Map
(define-map transactions
  { id: uint }
  {
    sender: principal,
    recipient: principal,
    amount: uint,
    status: (string-ascii 20),
    created-at: uint,
    reputation-points: uint,
    disputed: bool,
  }
)

;; User Reputation Map
(define-map user-reputation
  { user: principal }
  {
    total-points: uint,
    total-transactions: uint,
  }
)

;; Transaction Milestones
(define-map milestones { transaction-id: uint, milestone-id: uint } { description: (string-ascii 50), amount: uint, status: (string-ascii 20) })
;; Generate unique transaction ID
(define-data-var disputes-count uint u0)
(define-data-var arbitrator principal tx-sender)
(define-data-var next-transaction-id uint u1)

;; Create new transaction
(define-public (create-transaction
    (recipient principal)
    (amount uint)
  )
  (begin
    ;; Validate recipient
    (asserts! (is-valid-recipient recipient) ERR-INVALID-RECIPIENT)

    ;; Validate amount
    (asserts! (> amount u0) ERR-INSUFFICIENT-FUNDS)

    (let ((transaction-id (var-get next-transaction-id)))
      ;; Increment transaction ID
      (var-set next-transaction-id (+ transaction-id u1))

      ;; Store transaction
      (map-set transactions { id: transaction-id } {
        sender: tx-sender,
        recipient: recipient,
        amount: amount,
        status: "PENDING",
        created-at: block-height,
        reputation-points: u0,
      })

      (ok transaction-id)
    )
  )
)

;; Release funds to recipient
(define-public (release-funds (transaction-id uint))
  (begin
    ;; Validate transaction ID
    (asserts! (is-valid-transaction-id transaction-id) ERR-INVALID-TRANSACTION-ID)

    (let ((transaction (unwrap! (map-get? transactions { id: transaction-id })
        ERR-TRANSACTION-NOT-FOUND
      )))
      ;; Validate sender authorization
      (asserts! (is-eq tx-sender (get sender transaction)) ERR-UNAUTHORIZED)

      ;; Transfer STX
      (try! (stx-transfer? (get amount transaction) tx-sender
        (get recipient transaction)
      ))

      ;; Update transaction status
      (map-set transactions { id: transaction-id }
        (merge transaction { status: "COMPLETED" })
      )

      (ok true)
    )
  )
)

;; Add reputation points
(define-public (add-reputation-points
    (transaction-id uint)
    (points uint)
  )
  (begin
    ;; Validate transaction ID
    (asserts! (is-valid-transaction-id transaction-id) ERR-INVALID-TRANSACTION-ID)

    (let (
        (transaction (unwrap! (map-get? transactions { id: transaction-id })
          ERR-TRANSACTION-NOT-FOUND
        ))
        (sender (get sender transaction))
        (recipient (get recipient transaction))
      )
      ;; Validate recipient authorization and points
      (asserts! (is-eq tx-sender recipient) ERR-UNAUTHORIZED)
      (asserts! (> points u0) ERR-INVALID-POINTS)

      ;; Update user reputation
      (map-set user-reputation { user: sender } {
        total-points: (+
          (get total-points
            (default-to {
              total-points: u0,
              total-transactions: u0,
            }
              (map-get? user-reputation { user: sender })
            ))
          points
        ),
        total-transactions: (+
          (get total-transactions
            (default-to {
              total-points: u0,
              total-transactions: u0,
            }
              (map-get? user-reputation { user: sender })
            ))
          u1
        ),
      })

      ;; Update transaction reputation points
      (map-set transactions { id: transaction-id }
        (merge transaction { reputation-points: points })
      )

      (ok true)
    )
  )
)

;; Get user reputation
(define-read-only (get-user-reputation (user principal))
  (default-to {
    total-points: u0,
    total-transactions: u0,
  }
    (map-get? user-reputation { user: user })
  )
)

;; Get transaction details
(define-read-only (get-transaction-details (transaction-id uint))
  (map-get? transactions { id: transaction-id })
)
n
(define-public (resolve-dispute
    (transaction-id uint)
    (winner principal)
  )
  (begin
    (asserts! (is-arbitrator) ERR-NOT-ARBITRATOR)
    (let ((transaction (unwrap! (map-get? transactions { id: transaction-id })
        ERR-TRANSACTION-NOT-FOUND
      )))
      (asserts! (get disputed transaction) ERR-TRANSACTION-NOT-FOUND)
      ;; reusing error for brevity in micro-commit

      ;; In a real app, winner would get the funds. For now we just update status.
      (map-set transactions { id: transaction-id }
        (merge transaction {
          status: "RESOLVED",
          disputed: false,
        })
      )
      (ok true)
    )
  )
)
n;; Add a milestone to a transaction (Sender only)
(define-public (add-milestone (transaction-id uint) (milestone-id uint) (description (string-ascii 50)) (amount uint))
  (let
    (
      (transaction (unwrap! (map-get? transactions { id: transaction-id }) ERR-TRANSACTION-NOT-FOUND))
    )
    (asserts! (is-eq tx-sender (get sender transaction)) ERR-UNAUTHORIZED)
    (map-set milestones { transaction-id: transaction-id, milestone-id: milestone-id } { description: description, amount: amount, status: "PENDING" })
    (ok true)
  )
)
n;; Get current arbitrator
(define-read-only (get-arbitrator)
  (var-get arbitrator)
)
