package org.demo.db.user.management;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;

@Getter
@Setter
@NoArgsConstructor
@Table(name = "ROLES", indexes = {
        @Index(name = "IDX_ROLE_AUTHORITY", columnList = "AUTHORITY")
})
@Entity
public class Role implements GrantedAuthority {

    @GeneratedValue
    @Column(name = "ID")
    @Id
    private Long id;

    @Column(name = "AUTHORITY", unique = true)
    private String authority;

    @Override
    public String toString() {
        return "Role{" +
                "id=" + id +
                ", authority='" + authority + '\'' +
                '}';
    }
}
