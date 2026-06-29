;; AetherOS Certificate SBT - non-transferable reputation certificate
(define-non-fungible-token aetheros-certificate uint)
(define-constant ERR-NOT-AUTHORIZED (err u200))
(define-constant ERR-NON-TRANSFERABLE (err u201))
(define-data-var contract-owner principal tx-sender)
(define-data-var next-token-id uint u1)
(define-map certificate-metadata uint { recipient: principal, badge-type: (string-ascii 32), evidence-hash: (buff 32), minted-at: uint })

(define-public (mint-certificate (recipient principal) (badge-type (string-ascii 32)) (evidence-hash (buff 32)))
  (let ((id (var-get next-token-id)))
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (try! (nft-mint? aetheros-certificate id recipient))
    (map-set certificate-metadata id { recipient: recipient, badge-type: badge-type, evidence-hash: evidence-hash, minted-at: burn-block-height })
    (var-set next-token-id (+ id u1))
    (ok id)))

(define-public (transfer (id uint) (sender principal) (recipient principal)) ERR-NON-TRANSFERABLE)
(define-read-only (get-owner (id uint)) (nft-get-owner? aetheros-certificate id))
(define-read-only (get-certificate (id uint)) (map-get? certificate-metadata id))
