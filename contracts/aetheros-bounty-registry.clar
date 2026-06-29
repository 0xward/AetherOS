;; AetherOS Bounty Registry (no-custody)
;; On-chain record of warm-intro bounties. Does NOT hold funds.
;; sBTC payment happens wallet-to-wallet on approval (frontend post-condition).
;; Deployed mainnet tx: 0xbe74be438bb6f76815839e8bdac3420c9d685b9c9f2e62e363cd768af8e59120

(define-constant ERR-NOT-AUTHORIZED (err u300))
(define-constant ERR-NOT-FOUND (err u301))
(define-constant ERR-NOT-OPEN (err u302))
(define-constant ERR-NO-CONTRIBUTOR (err u303))
(define-constant ERR-ZERO-REWARD (err u304))

(define-data-var next-bounty-id uint u1)

(define-map bounties uint {
    creator: principal, contributor: (optional principal), reward: uint,
    target-hash: (buff 32), criteria-hash: (buff 32), status: (string-ascii 16), created-at: uint })

(define-public (create-bounty (reward uint) (target-hash (buff 32)) (criteria-hash (buff 32)))
  (let ((id (var-get next-bounty-id)))
    (asserts! (> reward u0) ERR-ZERO-REWARD)
    (map-set bounties id { creator: tx-sender, contributor: none, reward: reward, target-hash: target-hash, criteria-hash: criteria-hash, status: "open", created-at: burn-block-height })
    (var-set next-bounty-id (+ id u1))
    (ok id)))

(define-public (submit-proof (bounty-id uint))
  (let ((b (unwrap! (map-get? bounties bounty-id) ERR-NOT-FOUND)))
    (asserts! (is-eq (get status b) "open") ERR-NOT-OPEN)
    (map-set bounties bounty-id (merge b { contributor: (some tx-sender), status: "pending" }))
    (ok true)))

(define-public (approve (bounty-id uint))
  (let ((b (unwrap! (map-get? bounties bounty-id) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender (get creator b)) ERR-NOT-AUTHORIZED)
    (asserts! (is-eq (get status b) "pending") ERR-NOT-OPEN)
    (asserts! (is-some (get contributor b)) ERR-NO-CONTRIBUTOR)
    (map-set bounties bounty-id (merge b { status: "approved" }))
    (ok true)))

(define-public (reject (bounty-id uint))
  (let ((b (unwrap! (map-get? bounties bounty-id) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender (get creator b)) ERR-NOT-AUTHORIZED)
    (asserts! (is-eq (get status b) "pending") ERR-NOT-OPEN)
    (map-set bounties bounty-id (merge b { contributor: none, status: "open" }))
    (ok true)))

(define-read-only (get-bounty (bounty-id uint)) (map-get? bounties bounty-id))
(define-read-only (get-next-bounty-id) (var-get next-bounty-id))
