package org.demo.db.user.management;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LdapDemoUserRepository extends JpaRepository<LdapDemoUser, Long> {
    boolean existsByUsername(String username);

    LdapDemoUser findByUsername(String username);
}
