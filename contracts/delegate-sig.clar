(define-constant ERR_DELEGATION_INVALID_SIGNATURE (err 35))

(define-data-var reward-cycle-var uint u22)

;; #[allow(unchecked_data)]
(define-public (set-reward-cycle (cycle uint))
  (ok (var-set reward-cycle-var cycle))
)

(define-read-only (current-pox-reward-cycle) (var-get reward-cycle-var))

(define-read-only (verify-delegate-signature (sender principal)
                                             (delegate principal)
                                             (delegate-sig (buff 65))
                                             (reward-cycle uint))
  (let
    (
      ;; (msg { sender: sender, reward-cycle: (current-pox-reward-cycle) })
      (msg { sender: sender, reward-cycle: reward-cycle })
      (msg-bytes (unwrap! (to-consensus-buff? msg) (err 11))) ;;TODO
      (msg-hash (sha256 msg-bytes))
      (pubkey (unwrap! (secp256k1-recover? msg-hash delegate-sig) (err 12))) ;; TODO
    )
    (asserts! (secp256k1-verify msg-hash delegate-sig pubkey) (err 13))
    (asserts! (is-eq (unwrap! (principal-of? pubkey) (err 14)) delegate) (err 15))
    (ok true)
  )                                            
)

;; Verify a signature from the delegate that approves this specific stacker.
;; The message hash is generated from the consensus hash of the tuple 
;; `{ stacker, reward-cycle }`. Note that `reward-cycle` corresponds to the
;; _current_ reward cycle, not the reward cycle at which the delegation will start.
;; The public key is recovered from the signature and compared to the pubkey hash
;; of the delegator.
(define-read-only (verify-delegator-signature (stacker principal)
                                             (delegator principal)
                                             (delegator-sig (buff 65))
                                             (reward-cycle uint))
  (let
    (
      (msg { stacker: stacker, reward-cycle: reward-cycle })
      (msg-bytes (unwrap! (to-consensus-buff? msg) ERR_DELEGATION_INVALID_SIGNATURE)) ;;TODO
      (msg-hash (sha256 msg-bytes))
      (pubkey (unwrap! (secp256k1-recover? msg-hash delegator-sig) ERR_DELEGATION_INVALID_SIGNATURE)) ;; TODO
    )
    (asserts! (secp256k1-verify msg-hash delegator-sig pubkey) ERR_DELEGATION_INVALID_SIGNATURE)
    (asserts! (is-eq (unwrap! (principal-of? pubkey) ERR_DELEGATION_INVALID_SIGNATURE) delegator) ERR_DELEGATION_INVALID_SIGNATURE)
    (ok true)
  )                                            
)

(define-read-only (verify-signing-key-signature (stacker principal)
                                                (signing-key (buff 33))
                                                (signer-sig (buff 65)))
  (let
    (
      ;; (msg { stacker: stacker, reward-cycle: (current-pox-reward-cycle) })
      ;; (msg-bytes (unwrap! (to-consensus-buff? msg) ERR_DELEGATION_INVALID_SIGNATURE)) ;;TODO
      ;; ;; (msg-hash (sha256 msg-bytes))
      (msg-hash (get-signer-key-message-hash signing-key stacker))
      (pubkey (unwrap! (secp256k1-recover? msg-hash signer-sig) ERR_DELEGATION_INVALID_SIGNATURE)) ;; TODO
    )
    (asserts! (is-eq pubkey signing-key) ERR_DELEGATION_INVALID_SIGNATURE)
    (ok true)
  )                                            
)

(define-read-only (get-signer-key-message-hash (signer-key (buff 33)) (stacker principal))
  (let
    (
      (domain { name: "pox-4-signer", version: "1.0.0", chain-id: chain-id })
      (data-hash (sha256 (unwrap-panic 
        (to-consensus-buff? { stacker: stacker, reward-cycle: (current-pox-reward-cycle) }))))
      (domain-hash (sha256 (unwrap-panic (to-consensus-buff? domain))))
      ;; (message 
    )
    (sha256 (concat
      0x534950303138
      (concat domain-hash
      data-hash)
    ))
  )
)