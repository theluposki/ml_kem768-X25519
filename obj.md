ML_KEM + X25519

ML-KEM (Kyber - criptografia pós-quântica) com X25519 (ECDH clássico)

# O que a lib faz:

O esquema híbrido funciona em paralelo: ML-KEM-768 (pós-quântico) e X25519 (clássico) rodam simultaneamente, e os dois shared secrets são combinados via HKDF-SHA-256 usando o padrão do IETF draft kem-combiners:
IKM  = mlkemSS ‖ x25519SS
info = mlkemCT ‖ mlkemPublicKey  
K    = HKDF-SHA256(IKM, salt=0, info, 32 bytes)
A propriedade chave: o resultado é seguro se ao menos um dos dois algoritmos não for comprometido — proteção clássica hoje, quântica amanhã.
